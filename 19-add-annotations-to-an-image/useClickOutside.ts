import * as React from 'react';

export const useClickOutside = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [node, setNode] = React.useState<HTMLElement>();

    const open = () => setIsOpen(true);

    const close = () => setIsOpen(false);

    const toggle = () => setIsOpen(isOpen => !isOpen);

    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);

    const handleClick = React.useCallback((e) => {
        if (node) {
            node.contains(e.target) ? toggle() : close();
        }
    }, [node]);

    React.useEffect(() => {
        document.addEventListener("click", handleClick, true);
        document.addEventListener("touchstart", handleClick, true);

        return () => {
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("touchstart", handleClick, true);
        };
    }, [handleClick]);

    return [ref, isOpen, open, close];
};
