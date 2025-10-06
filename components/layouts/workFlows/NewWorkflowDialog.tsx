'use client'
import React from 'react'
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {cn} from "@/lib/utils";
import { motion } from 'framer-motion';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Loader from "@/components/Loader";

const NewWorkflowDialog = () => {
    const [name, setName] = React.useState('')

    const {
        isWorkflowsDialogOpen,
        setIsWorkflowsDialogOpen,
        createNewWorkFlow,
        isCreating,
    } = useWorkFlowState();

    return isWorkflowsDialogOpen && (
        <>
            {isWorkflowsDialogOpen && <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ duration: .1 }}
                onClick={() => setIsWorkflowsDialogOpen(false)}
                className={'screen bg-black/10 absolute inset-0 backdrop-blur-xs z-[9]'}/>}
            <div
                className={cn('!w-[800px] transition-300 absolute top-[50%] -translate-y-[50%] right-[50%] translate-x-[50%] !space-y-[10px] !m-[0px] !z-[10] rounded-md',
                    // rightSidebarState === sidebarState.runPanel && buildProcess.length > 0 ? '!h-[94%]' : '!h-[250px]',
                    '!h-[78%]',
                )}>
                <motion.div
                    initial={{opacity: 0, scale: .5, x: 50}}
                    // whileHover={{scale: 1.05, duration: .3}}
                    animate={{opacity: 1, scale: 1, x: 0}}
                    exit={{ opacity: 0 , scale: .5 }}
                    transition={{duration: .1}}
                    className={cn(`container-full transition-300 p-[20px] flex-col center rounded-md center border-[3px] border-neutral-800 !backdrop-blur-sm !bg-neutral-800/30`,
                    )}>
                    <div className={cn('w-full h-full gap-[10px] center !justify-start')}>
                        <div className={cn('center flex-col !items-start container-full !w-fit gap-[10px] !items=start !justify-start')}>
                            <label
                                htmlFor={'workflow-name'}
                                className={'text-xs font-semibold text-foreground/80'}
                            >
                                Workflow name
                            </label>
                            <input
                                id={'workflow-name'}
                                type={'text'}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={cn('w-[260px] text-xs px-[5px] font-semibold text-foreground/80 !border-[1px] border-neutral-700 outline-none h-[30px] rounded-sm bg-neutral-800')}
                            />
                        </div>
                    </div>
                    <div className={cn('center w-full !justify-end gap-[10px]')}>
                        <Button
                            type={'button'}
                            className={cn('text-xs w-[80px] text-foreground !bg-transparent h-[35px] hover:bg-neutral-900 transition-300')}
                            onClick={() => setIsWorkflowsDialogOpen(false)}
                        >
                            cancel
                        </Button>
                        <Button
                            disabled={isCreating}
                            type={'button'}
                            className={cn('text-xs w-[80px] gap-[4px] text-foreground bg-gradient-to-r from-cyan-500 to-cyan-700 h-[35px] hover:bg-neutral-900 transition-300')}
                            onClick={() => createNewWorkFlow(name)}
                        >
                            {isCreating && <Loader size={15} className={'animate-spin'}/>}
                            Create
                        </Button>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
export default NewWorkflowDialog
