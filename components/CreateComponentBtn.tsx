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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useCreateComponent, {FormDataType} from "@/hooks/components/useCreateComponent";
import {useState} from "react";

export function DialogBtn() {
    const [formData, setFormData] = useState<FormDataType>({
        name: 'My Component',
        fileName: "./component"
    })
    const {createComponent, loading} = useCreateComponent(formData)

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
                        <button type={'button'} className={'center w-[165px] h-[40px] rounded-md bg-accent'}>
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
                            <Label htmlFor="name-1">title</Label>
                            <Input id="name-1" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">File Name</Label>
                            <Input id="username-1" name="fileName" value={formData.fileName} onChange={handleChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button onClick={createComponent} className={'bg-accent'} type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
