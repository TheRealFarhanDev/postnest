import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

export const RenderSleepAlertDialog = () => {
  const [open, setOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const lastDismissed = localStorage.getItem("postnest_render_sleep_hide_until")
    const now = Date.now()

    if (!lastDismissed || now > parseInt(lastDismissed)) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      const hideUntil = Date.now() + 15 * 60 * 1000 // 15 minutes
      localStorage.setItem("postnest_render_sleep_hide_until", hideUntil.toString())
    }
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Server Waking Up</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            The backend server (hosted on Render) may take up to <strong>30 seconds</strong> to
            start after a period of inactivity. Thanks for your patience!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox id="delay-hide" onCheckedChange={(val) => setDontShowAgain(!!val)} />
          <Label htmlFor="delay-hide">Don’t show again for 15 minutes</Label>
        </div>

        <AlertDialogFooter className="mt-4">
          <Button onClick={handleClose}>Got it</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
