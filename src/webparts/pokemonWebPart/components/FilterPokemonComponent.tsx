import * as React from 'react';
import { observer } from "mobx-react";
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Icon } from '@fluentui/react/lib/Icon';
import { pokemonStore } from '../stores/PokemonStore';
import { Dropdown, IDropdownOption, Stack, IStackStyles, IIconProps } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';
import { SharedColors, NeutralColors } from '@fluentui/theme';

const buttonStyles = { root: { marginRight: 8 } };
const initialStyles: IStackStyles = {
  root:{
    marginTop: '6px'
  }
};
const TagStyles = {
  backgroundColor: SharedColors.cyanBlue10,
  color: NeutralColors.white,
  paddingLeft: "5px"
};

function FilterPokemonComponent(){
    const {ListTypes, ListCategories,TypeValue, CategoryValue, filterPokemon} = pokemonStore
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const TypeRef = React.useRef<string>('')
    const CategoryRef = React.useRef<string>('')

    const closeIcon: IIconProps = { iconName: 'Cancel' };

    const changeType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
      TypeRef.current = item.key as string
    }
    const changeCategory = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
      CategoryRef.current = item.key as string
    }
    const FilterSubmit = () => {
      dismissPanel();
      filterPokemon(TypeRef.current  , CategoryRef.current)
    }

    const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={ FilterSubmit } styles={buttonStyles}>
          Filter
        </PrimaryButton>
        <DefaultButton onClick={ dismissPanel }>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel],
    );

    return (
        <Stack enableScopedSelectors horizontal horizontalAlign="space-between" styles={initialStyles}>
            <Stack.Item align="center" >
            <div style={TagStyles}>Type: Tes<IconButton iconProps={closeIcon} title="Remove Filter" ariaLabel="Remove Filter" /></div>
              {
                (() => {
                  if(TypeValue !== ''){
                    return(
                    <div>Type: { TypeValue } <IconButton iconProps={closeIcon} title="Remove Filter" ariaLabel="Remove Filter" /></div>
                    )
                  }
                  if(CategoryValue !== ''){
                    return(
                    <div>Category: { CategoryValue } <IconButton iconProps={closeIcon} title="Remove Filter" ariaLabel="Remove Filter" /></div>
                    )
                  }
                  return <div>&nbsp;</div>
                })() 
              }
            </Stack.Item>
            <Stack.Item align="center">
                <PrimaryButton text="Filter" onClick={openPanel}><Icon iconName="Filter" /></PrimaryButton>
                <Panel
                    isOpen={isOpen}
                    onDismiss={dismissPanel}
                    headerText="Filter Pokemon"
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={onRenderFooterContent}
                    // Stretch panel content to fill the available height so the footer is positioned
                    // at the bottom of the page
                    isFooterAtBottom={true}
                >
                    
                    <Dropdown
                      placeholder="Select a type"
                      label="Pokemon Type"
                      options={ListTypes}
                      onChange={changeType}
                      defaultSelectedKey={TypeValue}
                    />
                    <Dropdown
                      placeholder="Select a category"
                      label="Pokemon Category"
                      options={ListCategories}
                      onChange={changeCategory}
                      defaultSelectedKey={CategoryValue}
                    />
                </Panel>
            </Stack.Item>
        </Stack>
    )
}
export default observer(FilterPokemonComponent)