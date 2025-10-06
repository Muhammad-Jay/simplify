'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {template} from "@/constants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Plus} from "lucide-react"
import useCreateComponent, {FormDataType} from "@/hooks/components/useCreateComponent";
import {useState, useEffect} from "react";
import SelectWrapper from "@/components/SelectWrapper";
import {useWorkFlowState} from "@/context/WorkSpaceContext";

export function DialogBtn() {
    const [formData, setFormData] = useState<FormDataType>({
        name: 'My Component',
        template: "react-ts"
    })
    const [workFlowName, setWorkFlowName] = useState('')

    const [editorTemplate, setEditorTemplate] = useState("")
    const {createComponent, loading} = useCreateComponent(formData)
    const {
        createNewWorkFlow,
        setIsWorkflowsDialogOpen
    } = useWorkFlowState();


    const handleChange = (e: any) => {
        setWorkFlowName(e.target.value)
    }
    return (

                        <button
                            type={'button'}
                            onClick={() => setIsWorkflowsDialogOpen(true)}
                            disabled={loading}
                            className={'center gap-[4px] w-[150px] h-[35px] rounded-sm text-sm font-bold flex-nowrap cursor-pointer button-gradient'}>
                           <Plus size={18}/>
                            New Workflow
                        </button>

    )
}
