'use client'

import React from 'react';
import {cn} from "@/lib/utils";
import {motion} from 'framer-motion'

type PanelWrapperProps = {
    className?: string;
    children?: React.ReactNode;
    boolean?: boolean;
    position?: 'Top Right' | 'Bottom Right' | 'Top Left' | 'Bottom Left' | 'Bottom Center' | 'Top Center' | 'Left Center' | 'Right Center'
}

const panelPosition = {
    topRight: 'Top Right',
    bottomRight: 'Bottom Right',
    topLeft: 'Top Left',
    bottomLeft: 'Bottom Left',
    leftCenter: 'Left Center',
    rightCenter: 'Right Center',
    topCenter: 'Top Center',
    bottomCenter: 'Bottom Center'
}

export function PanelWrapper({ children, className, boolean, position = 'Top Left' }: PanelWrapperProps) {

    return (
        <motion.div
            initial={{opacity: 0, scale: .5, x: 50}}
            // whileHover={{scale: 1.05, duration: .3}}
            animate={{opacity: 1, scale: 1, x: 0}}
            exit={{ opacity: 0 , scale: .5 }}
            transition={{duration: .1}}
            className={cn('container-fit center absolute border-1 border-neutral-800 rounded-md bg-neutral-800/60 backdrop-blur-md',
                position === panelPosition.topLeft && 'top-[10px] left-[10px]',
                position === panelPosition.bottomLeft && 'bottom-[10px] left-[10px]',
                position === panelPosition.topRight && 'top-[10px] right-[10px]',
                position === panelPosition.bottomRight && 'bottom-[10px] right-[10px]',
                position === panelPosition.topCenter && 'top-[10px] right-[50%] translate-x-[50%]',
                position === panelPosition.bottomCenter && 'bottom-[10px] right-[50%] translate-x-[50%]',
                position === panelPosition.leftCenter && 'left-[10px] bottom-[50%] translate-y-[50%]',
                position === panelPosition.rightCenter && 'right-[10px] bottom-[50%] translate-y-[50%]',
                className)}>
            {children}
        </motion.div>
    )
}