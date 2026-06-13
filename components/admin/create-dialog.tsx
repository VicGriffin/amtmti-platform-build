"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

export type Field = {
  name: string
  label: string
  type?: "text" | "number" | "textarea" | "select" | "checkbox" | "datetime-local" | "url"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  defaultValue?: string | number
}

export function CreateDialog({
  title,
  description,
  triggerLabel,
  fields,
  action,
}: {
  title: string
  description?: string
  triggerLabel: string
  fields: Field[]
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await action(formData)
      if (res.ok) {
        toast.success(`${title} created.`)
        setOpen(false)
      } else {
        toast.error(res.error ?? "Could not save.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            {triggerLabel}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form action={onSubmit} className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-1">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              {f.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name={f.name} defaultChecked={Boolean(f.defaultValue)} className="size-4" />
                  {f.label}
                </label>
              ) : (
                <>
                  <Label htmlFor={f.name}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea id={f.name} name={f.name} placeholder={f.placeholder} required={f.required} rows={3} />
                  ) : f.type === "select" ? (
                    <select
                      id={f.name}
                      name={f.name}
                      defaultValue={f.defaultValue as string}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={f.name}
                      name={f.name}
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      required={f.required}
                      defaultValue={f.defaultValue}
                    />
                  )}
                </>
              )}
            </div>
          ))}
          <DialogFooter className="mt-2">
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
