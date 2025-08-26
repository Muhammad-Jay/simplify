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

export function DialogBtn() {
    const [formData, setFormData] = useState<FormDataType>({
        name: 'My Component',
        template: "react-ts"
    })
    const [editorTemplate, setEditorTemplate] = useState("")
    const {createComponent, loading} = useCreateComponent(formData)

    useEffect(() => {
        if (editorTemplate) return setFormData(prev => ({...prev, template: editorTemplate}))
    }, [editorTemplate]);

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }
    return (
        <Dialog>
            <form onSubmit={async (e) => {
                    e.preventDefault();
                    await createComponent();
                }}>
                <DialogTrigger asChild>
                        <button
                            type={'button'}
                            disabled={loading}
                            className={'center gap-[5px] w-[165px] h-[40px] rounded-md text-xs cursor-pointer bg-accent'}>
                           <Plus size={18}/>
                            Create Component
                        </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[325px] md:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Edit Component</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="fileName">Template</Label>
                            <SelectWrapper items={template} setValue={setEditorTemplate} className={"w-full rounded-full center bg-zinc-900"}>
                                <p>{formData.template}</p>
                            </SelectWrapper>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost" className={"text-xs"}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={createComponent} className={'bg-accent text-xs'} type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
