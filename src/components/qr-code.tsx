import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";

type QRCodeDisplayProps = {
  link: string;
  label?: string;
};

export function QrCode({ link, label = "QR Code" }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar o link.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <QrCodeIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription className="flex flex-col items-center">
            <QRCodeSVG value={link} size={256} className="bg-white p-3" />
            <span className="mt-2 text-sm text-gray-500 text-center break-all">
              {link}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          <Button onClick={handleCopy} variant="secondary">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
