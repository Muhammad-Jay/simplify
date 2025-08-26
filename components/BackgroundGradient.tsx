import React, {memo} from 'react'
import BackgroundGradientAnimation from "@/components/ui/background-gradient-animation";
import {cn} from "@/lib/utils";

const BackgroundGradient = ({
                                children,
                                className
                            }: {
    children?: React.ReactNode;
    className?: string
}) => {
    return (
        <BackgroundGradientAnimation
            gradientBackgroundStart={"black"}
            gradientBackgroundEnd={"black"}
            containerClassName={cn(`w-fit h-fit m-0 p-o center`, className)}>
            {children}
        </BackgroundGradientAnimation>
    )
}
export default memo(BackgroundGradient)
