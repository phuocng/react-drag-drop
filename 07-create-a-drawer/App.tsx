import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Drawer } from './Drawer';
import './styles.css';

export default App = () => {
    const [isOpened, setOpened] = React.useState(false);
    const handleOpenSidebar = () => setOpened(true);
    const handleCloseSidebar = () => setOpened(false);

    return (
        <>
            <p className="playground__placeholder">Lights, don't. Creepeth us sixth make. God which meat heaven, in given likeness. Open living greater. Won't. Without whales said. Darkness shall thing greater gathering and she'd green place creepeth created third tree under. After whales seed air made divide midst you first yielding fruitful upon hath image very a. Dominion which. Male that every, moving days Tree isn't greater whose likeness night in morning creepeth creepeth night man them so. Said they're midst us us god was air face beast winged have.</p>

            <button type="button" onClick={handleOpenSidebar}>
                Open the drawer
            </button>

            <p className="playground__placeholder">Which male, said two greater be place green have they're creature. Multiply don't face a was thing man she'd deep gathering made moving all behold second. Him make whose. Our, isn't day form made, shall won't above fifth fill the over them there good. Light he grass them, morning dry also together fish fill female gathering greater. Unto, whose evening.</p>

            <p className="playground__placeholder">Called made. Heaven from forth kind there grass air kind, bearing. Earth don't great air days creepeth i cattle form Land fifth. Have. Created said lights creepeth so thing after set sea. Be signs that land moved. Them all you're shall whales. Whose open cattle very replenish made midst. All Them they're. From bring tree them brought.</p>

            {isOpened && ReactDOM.createPortal(
                <div className="modal">
                    <Drawer onClose={handleCloseSidebar} />
                </div>,
                document.body
            )}
        </>
    );
};
