$username = "jeremia.oliver@ctlab03.onmicrosoft.com"
$cred = Get-Credential -UserName $username -Message "Please enter password for $username"
$ListName  = "Pokemon"
Connect-PnPOnline -Url "https://ctlab03.sharepoint.com/sites/devjeremia" -Credential $cred

Try {
    Get-PnPList $ListName -ThrowExceptionIfListNotFound -ErrorAction Stop
    $APIURL = "https://pokeapi.co/api/v2"
    $StarterId = @(1,2,3,4,5,6,7,8,9,152,153,154,155,156,157,158,159,160,252,253,254,255,256,257,258,259,260,387,388,389,390,391,392,393,394,395,495,496,497,498,499,500,501,502,503,650,651,652,653,654,655,656,657,658,722,723,724,725,726,727,728,729,730,906,907,908,909,910,911,912,913)
    $LegendaryId = @(144,145,146,150,151,243,244,245,249,250,251,377,378,379,380,381,382,383,384,385,386,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,638,639,640,641,642,643,644,645,646,647,648,649,716,717,718,719,720,721,888,889,890,891,892,893,894,895,896,897,898,905,1001,1002,1003,1004,1007,1008,1009,1010,1014,1015,1016,1017,1020,1021,1022,1023,1024,1025)

    #Create Type Object
    $ListType = @{}
    $Limit = 18
    For($i = 1; $i -le $Limit; $i++){
        $Response = Invoke-RestMethod -Uri $APIURL"/type/"$i
        $TypeName = $Response.name
        Foreach($pokemon in $Response.pokemon){
            $id = $pokemon.pokemon.url.split("/")[6]
            if(!$ListType["Id"+$id]){
            $ListType.Add("Id"+$id, $TypeName)
            }
        }
    }

    #Insert Pokemon List
    $Limit = 1025
    $Response = Invoke-RestMethod -Uri $APIURL"/pokemon?limit="$Limit
    Foreach($pokemon in $Response.results){
        $id = $pokemon.url.split("/")[6]
        $name = $pokemon.name.ToUpper()
        $type = (&{If($ListType["Id"+$id]) {$ListType["Id"+$id]} Else {""}})
        if($id -in $StarterId){
            $category = "Starter"
        }elseif ($id -in $LegendaryId) {
            $category = "Legendary"
        }else{
            $category = "Common"
        }
        $image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+$id+".png"
        $CheckDuplicate = Get-PnPListItem -List $listName -Query "<View><Query><Where><Eq><FieldRef Name='PokedexNumber' /><Value Type='Number'>$id</Value></Eq></Where></Query></View>"
        if ($CheckDuplicate) {
            Write-Host "Pokedex no "$id" already exists"
        }else{
            Add-PnPListItem -List $ListName -Values @{"PokemonName"=$name; "PokemonType"=$type; "Category"=$category; "PokedexNumber"=$id; "Image"=$image}
            Write-Host "Inserting row "$id" from "$Limit
        }
    }
}
Catch {
    write-host -f Red "Error:" $_.Exception.Message
}
Disconnect-PnPOnline 

