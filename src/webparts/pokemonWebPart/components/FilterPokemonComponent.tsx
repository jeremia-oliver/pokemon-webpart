import * as React from 'react';
import { observer } from "mobx-react";
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Icon } from '@fluentui/react/lib/Icon';

const buttonStyles = { root: { marginRight: 8 } };

function ListPokemonComponent(){
    
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={dismissPanel} styles={buttonStyles}>
          Filter
        </PrimaryButton>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel],
    );

    return (
        <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10">A</div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">
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
                    <p>Content goes here.</p>
                </Panel>
            </div>
            </div>
        </div>
    )
}
export default observer(ListPokemonComponent)