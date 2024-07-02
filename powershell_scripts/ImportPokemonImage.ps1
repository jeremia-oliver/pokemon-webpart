
$username = "jeremia.oliver@ctlab03.onmicrosoft.com"
$cred = Get-Credential -UserName $username -Message "Please enter password for $username"
$ListName  = "Pokemon"
$DocumentName  = "Pokemon Lib"
Connect-PnPOnline -Url "https://ctlab03.sharepoint.com/sites/devjeremia" -Credential $cred

Try {
    Get-PnPList $ListName -ThrowExceptionIfListNotFound -ErrorAction Stop
    $Limit = 1025
    $ListItems = Get-PnPListItem -List $ListName -Query "<View><Query><Where><Leq><FieldRef Name='PokedexNumber' /><Value Type='Number'>$Limit</Value></Leq></Where></Query></View>"
    foreach($ListItem in $ListItems)
    { 
        $Library = Get-PnPList -Identity $DocumentName -Includes RootFolder
        $ServerFilePath = $ListItem['Image'].url
        $FileURL = $library.RootFolder.ServerRelativeUrl+"/"+$ListItem['PokemonName']+".png"
        if (!(Get-PnPFile -Url $FileURL -AsListItem -ErrorAction SilentlyContinue)) {
            $ImageStream = Invoke-WebRequest -URI $ServerFilePath -UseBasicParsing
            Add-PnPFile -Folder $DocumentName -FileName ($ListItem['PokemonName']+".png") -Stream $ImageStream.RawContentStream -Values @{"PokemonType"= $ListItem['PokemonType'];"Category" = $ListItem['Category']; "PokedexNumber"= $ListItem['PokedexNumber']}
            Write-Host "Pokedex no "$ListItem['PokedexNumber']" uploaded successfully."
        } else {
            Write-Host "File already exists!"
        }
    }
}
Catch {
    write-host -f Red "Error:" $_.Exception.Message
}
Disconnect-PnPOnline 

