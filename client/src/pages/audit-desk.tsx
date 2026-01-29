import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Upload,
  FileText,
  CheckCircle,
  Lock,
  Send,
  ChevronDown,
  ChevronUp,
  File,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import { NewInfoAlert } from "@/components/new-info-alert";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useMockData } from "@/lib/mock-data";
import { ProcessStatus } from "@shared/schema";
import { useState } from "react";

export default function AuditDesk() {
  const [, params] = useRoute("/processes/:id");
  const processId = params?.id;
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [expandedUploads, setExpandedUploads] = useState<Set<string>>(new Set());

  const { getProcessDetail, updateProcessStatus, finalizeProcess } = useMockData();

  const processDetail = processId ? getProcessDetail(processId) : undefined;

  const handleStatusChange = (newStatus: string) => {
    if (!processId) return;

    if (newStatus === ProcessStatus.INCOMPLETE && !comment.trim()) {
      toast({
        title: "Comentario requerido",
        description: "Debes agregar un comentario para el cliente cuando marcas el proceso como incompleto.",
        variant: "destructive",
      });
      return;
    }

    updateProcessStatus(
      processId,
      newStatus,
      newStatus === ProcessStatus.INCOMPLETE ? comment : undefined
    );

    toast({
      title: "Estado actualizado",
      description: "El estado del proceso ha sido actualizado exitosamente.",
    });
    setComment("");
  };

  const handleFinalize = () => {
    if (!processId) return;
    finalizeProcess(processId);
    toast({
      title: "Proceso finalizado",
      description: "El proceso ha sido aprobado y bloqueado para nuevas subidas.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Descarga simulada",
      description: "En producción, aquí se descargaría un archivo ZIP con los XMLs únicos.",
    });
  };

  const handleDownloadExcel = () => {
    toast({
      title: "Descarga simulada",
      description: "En producción, aquí se descargaría el papel de trabajo en Excel.",
    });
  };

  const toggleUpload = (uploadId: string) => {
    const newExpanded = new Set(expandedUploads);
    if (newExpanded.has(uploadId)) {
      newExpanded.delete(uploadId);
    } else {
      newExpanded.add(uploadId);
    }
    setExpandedUploads(newExpanded);
  };

  if (!processDetail) {
    return (
      <div className="space-y-6">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <EmptyState
          icon="folder"
          title="Proceso no encontrado"
          description="El proceso que buscas no existe o ha sido eliminado."
          action={
            <Link href="/">
              <Button>Ir al Dashboard</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const { process, taxpayer, uploads, uniqueFilesCount, totalFilesCount } = processDetail;
  const isLocked = process.isLocked === "true";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/taxpayers/${process.taxpayerId}`}>
            <Button variant="ghost" size="icon" data-testid="button-back-to-taxpayer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold" data-testid="text-process-name">
                {process.name}
              </h1>
              <Badge variant="secondary">{process.year}</Badge>
              {isLocked && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Bloqueado
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {taxpayer.name} · {taxpayer.rfc}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={process.status as any} />
          <NewInfoAlert show={process.hasNewInfo === "true"} />
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cargas
            </CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-uploads">
              {uploads.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Archivos Totales
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-files">
              {totalFilesCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Archivos Únicos
            </CardTitle>
            <File className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="text-unique-files">
              {uniqueFilesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalFilesCount - uniqueFilesCount} duplicados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleDownload}
                disabled={uniqueFilesCount === 0}
                className="w-full"
                data-testid="button-download-all"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Todo (.zip)
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadExcel}
                disabled={uniqueFilesCount === 0}
                className="w-full"
                data-testid="button-download-excel"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Papel de Trabajo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Management */}
      {!isLocked && (
        <Card>
          <CardHeader>
            <CardTitle>Panel de Control</CardTitle>
            <CardDescription>
              Gestiona el estado del proceso y comunica con el cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium">Cambiar Estado</label>
                <Select
                  value={process.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProcessStatus.PENDING_REVIEW}>
                      Pendiente de Revisión
                    </SelectItem>
                    <SelectItem value={ProcessStatus.IN_REVIEW}>En Revisión</SelectItem>
                    <SelectItem value={ProcessStatus.INCOMPLETE}>
                      Faltan Datos
                    </SelectItem>
                    <SelectItem value={ProcessStatus.CORRECTED}>Corregido</SelectItem>
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={uniqueFilesCount === 0}
                      data-testid="button-finalize"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar y Finalizar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Finalizar Proceso</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción cerrará el proceso y bloqueará nuevas subidas de archivos.
                        ¿Estás seguro de que deseas continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleFinalize}
                        data-testid="button-confirm-finalize"
                      >
                        Sí, Finalizar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Comentarios para el Cliente
                  {process.status === ProcessStatus.INCOMPLETE && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </label>
                <Textarea
                  placeholder="Escribe un mensaje para el cliente indicando qué información adicional necesitas..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  data-testid="textarea-feedback"
                />
                {process.feedbackComment && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Último comentario enviado:</p>
                    <p className="text-sm">{process.feedbackComment}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    if (comment.trim()) {
                      handleStatusChange(ProcessStatus.INCOMPLETE);
                    }
                  }}
                  disabled={!comment.trim()}
                  className="w-full"
                  data-testid="button-send-feedback"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar y Marcar como Faltan Datos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Process Notice */}
      {isLocked && (
        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800 dark:text-emerald-300">
                  Proceso Finalizado
                </h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Este proceso ha sido aprobado y está bloqueado para nuevas subidas de archivos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Control de Cargas (Entregas)</CardTitle>
          <CardDescription>
            Historial de todas las entregas de archivos del cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploads.length ? (
            <EmptyState
              icon="files"
              title="Sin cargas"
              description="El cliente aún no ha subido archivos para este proceso."
            />
          ) : (
            <div className="space-y-3">
              {uploads
                .sort((a, b) => b.uploadNumber - a.uploadNumber)
                .map((upload) => (
                  <Collapsible
                    key={upload.id}
                    open={expandedUploads.has(upload.id)}
                    onOpenChange={() => toggleUpload(upload.id)}
                  >
                    <div
                      className="border rounded-lg overflow-hidden"
                      data-testid={`upload-${upload.id}`}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 hover-elevate cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Carga #{upload.uploadNumber}</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(upload.createdAt!), "dd MMM yyyy, HH:mm", {
                                  locale: es,
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{upload.files.length} archivos</Badge>
                            {expandedUploads.has(upload.id) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Separator />
                        <div className="p-4">
                          {upload.files.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No hay archivos en esta carga
                            </p>
                          ) : (
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>UUID</TableHead>
                                    <TableHead>Archivo</TableHead>
                                    <TableHead>RFC Emisor</TableHead>
                                    <TableHead>RFC Receptor</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Fecha</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {upload.files.map((file) => (
                                    <TableRow
                                      key={file.id}
                                      data-testid={`file-${file.id}`}
                                    >
                                      <TableCell className="font-mono text-xs">
                                        {file.uuid.slice(0, 8)}...
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {file.fileName}
                                      </TableCell>
                                      <TableCell className="font-mono text-xs">
                                        {file.issuerRfc || "—"}
                                      </TableCell>
                                      <TableCell className="font-mono text-xs">
                                        {file.receiverRfc || "—"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {file.amount
                                          ? `$${parseFloat(file.amount).toLocaleString("es-MX", {
                                              minimumFractionDigits: 2,
                                            })}`
                                          : "—"}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {file.issueDate || "—"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
