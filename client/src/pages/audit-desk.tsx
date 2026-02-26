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
  History,
  ArrowRight,
  MessageSquare,
  X,
  FileQuestion,
  UploadCloud,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMockData } from "@/lib/mock-data";
import { ProcessStatus, type ProcessStatusType } from "@shared/schema";
import { useState, useRef } from "react";

export default function AuditDesk() {
  const [, params] = useRoute("/processes/:id");
  const processId = params?.id;
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [expandedUploads, setExpandedUploads] = useState<Set<string>>(new Set());
  const [selectedDocTypes, setSelectedDocTypes] = useState<Set<string>>(new Set());
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [stagedEntries, setStagedEntries] = useState<{ docType: string; fileName: string; comment: string }[]>([]);
  const [uploadDocType, setUploadDocType] = useState("");
  const [uploadCustomDocType, setUploadCustomDocType] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadComment, setUploadComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    "Facturas de Ingreso",
    "Facturas de Egreso",
    "Complementos de Pago",
    "Notas de Crédito",
    "Recibos de Nómina",
    "Retenciones",
    "Constancias de Situación Fiscal",
    "Declaraciones Mensuales",
    "Declaración Anual",
    "Estados de Cuenta Bancarios",
    "Acuses de Recibo SAT",
  ];

  const toggleDocType = (docType: string) => {
    setSelectedDocTypes((prev) => {
      const next = new Set(prev);
      if (next.has(docType)) {
        next.delete(docType);
      } else {
        next.add(docType);
      }
      return next;
    });
  };

  const { getProcessDetail, updateProcessStatus, finalizeProcess, getAuditLog, simulateUpload, getRequestedDocTypes } = useMockData();

  const processDetail = processId ? getProcessDetail(processId) : undefined;

  const handleStatusChange = (newStatus: string) => {
    if (!processId) return;

    if (newStatus === ProcessStatus.INCOMPLETE && !comment.trim() && selectedDocTypes.size === 0) {
      toast({
        title: "Comentario o documentos requeridos",
        description: "Debes agregar un comentario o seleccionar los documentos faltantes cuando marcas el proceso como incompleto.",
        variant: "destructive",
      });
      return;
    }

    updateProcessStatus(
      processId,
      newStatus,
      newStatus === ProcessStatus.INCOMPLETE && comment.trim() ? comment : undefined,
      newStatus === ProcessStatus.INCOMPLETE ? Array.from(selectedDocTypes) : undefined
    );

    toast({
      title: "Estado actualizado",
      description: "El estado del proceso ha sido actualizado exitosamente.",
    });
    setComment("");
    setSelectedDocTypes(new Set());
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

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    setUploadFileName(event.target.files[0].name);
    event.target.value = "";
  };

  const resolvedUploadDocType = uploadDocType === "__custom__" ? uploadCustomDocType.trim() : uploadDocType;

  const shortenFileName = (name: string, maxLen = 10) => {
    if (name.length <= maxLen) return name;
    const ext = name.lastIndexOf(".") > 0 ? name.slice(name.lastIndexOf(".")) : "";
    const base = name.slice(0, name.lastIndexOf(".") > 0 ? name.lastIndexOf(".") : name.length);
    const keep = maxLen - ext.length - 1;
    if (keep <= 0) return name.slice(0, maxLen) + "…";
    return base.slice(0, keep) + "…" + ext;
  };

  const handleAddEntry = () => {
    if (!resolvedUploadDocType || !uploadFileName) return;
    setStagedEntries((prev) => [...prev, { docType: resolvedUploadDocType, fileName: uploadFileName, comment: uploadComment.trim() }]);
    setUploadDocType("");
    setUploadCustomDocType("");
    setUploadFileName("");
    setUploadComment("");
  };

  const handleConfirmUpload = () => {
    if (!processId || stagedEntries.length === 0) return;
    simulateUpload(processId, stagedEntries.map((e) => e.fileName));
    toast({
      title: "Archivos subidos",
      description: `Se subieron ${stagedEntries.length} archivo(s) exitosamente.`,
    });
    setStagedEntries([]);
    setUploadModalOpen(false);
  };

  const resetUploadModal = () => {
    setStagedEntries([]);
    setUploadDocType("");
    setUploadCustomDocType("");
    setUploadFileName("");
    setUploadComment("");
  };

  const handleDownloadFile = (fileName: string) => {
    toast({
      title: "Descarga simulada",
      description: `En producción, aquí se descargaría "${fileName}".`,
    });
  };

  const handleDownloadUpload = (uploadNumber: number) => {
    toast({
      title: "Descarga simulada",
      description: `En producción, aquí se descargarían todos los archivos de la Carga #${uploadNumber} en ZIP.`,
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

      {/* Actions Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          onClick={handleDownload}
          disabled={uniqueFilesCount === 0}
          data-testid="button-download-all"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar Todo (.zip)
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadExcel}
          disabled={uniqueFilesCount === 0}
          data-testid="button-download-excel"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Papel de Trabajo
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">
          {uniqueFilesCount} archivos únicos · {totalFilesCount - uniqueFilesCount} duplicados · {uploads.length} cargas
        </span>
      </div>

      {/* Panel de Control - Two Column Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Panel de Control</CardTitle>
          <CardDescription>
            Gestiona el estado del proceso y comunica con el cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Controls */}
            <div className="space-y-4">
              {!isLocked ? (
                <>
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
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <FileQuestion className="h-4 w-4" />
                      Documentos Faltantes
                    </label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (value && !selectedDocTypes.has(value)) {
                          toggleDocType(value);
                        }
                      }}
                    >
                      <SelectTrigger data-testid="select-doc-types">
                        <SelectValue placeholder="Seleccionar tipo de documento..." />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((docType) => (
                          <SelectItem
                            key={docType}
                            value={docType}
                            disabled={selectedDocTypes.has(docType)}
                          >
                            {docType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedDocTypes.size > 0 && (
                      <div className="flex flex-wrap gap-1.5" data-testid="selected-doc-types">
                        {Array.from(selectedDocTypes).map((docType) => (
                          <Badge
                            key={docType}
                            variant="secondary"
                            className="gap-1 cursor-pointer hover:bg-destructive/10"
                            onClick={() => toggleDocType(docType)}
                          >
                            {docType}
                            <X className="h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Comentarios para el Cliente
                    </label>
                    <Textarea
                      placeholder="Escribe un mensaje adicional para el cliente..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      data-testid="textarea-feedback"
                    />
                    {process.feedbackComment && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Último comentario enviado:</p>
                        <p className="text-sm whitespace-pre-line">{process.feedbackComment}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (comment.trim() || selectedDocTypes.size > 0) {
                          handleStatusChange(ProcessStatus.INCOMPLETE);
                        }
                      }}
                      disabled={!comment.trim() && selectedDocTypes.size === 0}
                      className="w-full"
                      data-testid="button-send-feedback"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar y Marcar como Faltan Datos
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        resetUploadModal();
                        setUploadModalOpen(true);
                      }}
                      className="w-full"
                      data-testid="button-open-upload-modal"
                    >
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Subir Archivos XML
                    </Button>

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
                </>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-800 dark:text-emerald-300">
                      Proceso Finalizado
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Este proceso ha sido aprobado y está bloqueado para nuevas subidas.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Audit History */}
            <div className="lg:border-l lg:pl-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Historial de Cambios</h3>
                {processId && (() => {
                  const count = getAuditLog(processId).length;
                  return count > 0 ? (
                    <Badge variant="secondary" className="text-xs">{count}</Badge>
                  ) : null;
                })()}
              </div>
              {processId && (() => {
                const entries = getAuditLog(processId);
                if (entries.length === 0) {
                  return (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay cambios registrados.
                    </p>
                  );
                }
                return (
                  <div className="relative max-h-[400px] overflow-y-auto pr-2">
                    <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border" />
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <div key={entry.id} className="flex gap-3 relative" data-testid={`audit-entry-${entry.id}`}>
                          <div className="relative z-10 mt-1 flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                              {entry.action === "upload" ? (
                                <UploadCloud className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 pb-2 min-w-0">
                            {entry.action === "upload" ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-medium">Carga de archivos</span>
                                {entry.uploadedFiles && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    {entry.uploadedFiles.length} archivo{entry.uploadedFiles.length !== 1 ? "s" : ""}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {entry.previousStatus && (
                                  <StatusBadge status={entry.previousStatus as ProcessStatusType} size="sm" />
                                )}
                                <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                {entry.newStatus && (
                                  <StatusBadge status={entry.newStatus as ProcessStatusType} size="sm" />
                                )}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(entry.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                            </p>
                            {(entry.requestedDocTypes || entry.feedbackComment || entry.uploadedFiles) && (
                              <div className="mt-1.5 p-2 bg-muted rounded-md space-y-1.5" data-testid={`audit-comment-${entry.id}`}>
                                {entry.requestedDocTypes && entry.requestedDocTypes.length > 0 && (
                                  <div className="flex items-start gap-1.5">
                                    <FileQuestion className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <div className="flex flex-wrap gap-1">
                                      {entry.requestedDocTypes.map((doc) => (
                                        <Badge key={doc} variant="outline" className="text-[10px] px-1.5 py-0">
                                          {doc}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {entry.feedbackComment && (
                                  <div className="flex gap-1.5">
                                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <p className="text-xs">{entry.feedbackComment}</p>
                                  </div>
                                )}
                                {entry.uploadedFiles && entry.uploadedFiles.length > 0 && (
                                  <div className="flex items-start gap-1.5">
                                    <File className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <div className="flex flex-col gap-0.5">
                                      {entry.uploadedFiles.map((f) => (
                                        <span key={f} className="text-[10px] text-muted-foreground">{f}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadUpload(upload.uploadNumber);
                              }}
                              data-testid={`button-download-upload-${upload.id}`}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Descargar
                            </Button>
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
                                    <TableHead className="w-[50px]"></TableHead>
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
                                      <TableCell>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => handleDownloadFile(file.fileName)}
                                          data-testid={`button-download-file-${file.id}`}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
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
      <Dialog open={uploadModalOpen} onOpenChange={(open) => {
        setUploadModalOpen(open);
        if (!open) resetUploadModal();
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Subir Archivos</DialogTitle>
            <DialogDescription>
              Especifica el tipo de documento, selecciona el archivo y agrega un comentario opcional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="grid grid-cols-[1fr,auto] gap-2 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Tipo de Documento</label>
                  <Select value={uploadDocType} onValueChange={(val) => {
                    setUploadDocType(val);
                    if (val !== "__custom__") setUploadCustomDocType("");
                  }}>
                    <SelectTrigger className="h-9" data-testid="select-upload-doc-type">
                      <SelectValue placeholder="Seleccionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((dt) => (
                        <SelectItem key={dt} value={dt}>{dt}</SelectItem>
                      ))}
                      <SelectItem value="__custom__">Otro (especificar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="*/*"
                  className="hidden"
                  onChange={handleFileSelected}
                  data-testid="input-file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="upload-drop-zone"
                >
                  <File className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  {uploadFileName ? shortenFileName(uploadFileName) : "Elegir archivo"}
                </Button>
              </div>
              {uploadDocType === "__custom__" && (
                <Input
                  placeholder="Escribe el tipo de documento..."
                  className="h-9"
                  value={uploadCustomDocType}
                  onChange={(e) => setUploadCustomDocType(e.target.value)}
                  data-testid="input-custom-doc-type"
                />
              )}
              <div className="grid grid-cols-[1fr,auto] gap-2 items-end">
                <Input
                  placeholder="Comentario opcional..."
                  className="h-9"
                  value={uploadComment}
                  onChange={(e) => setUploadComment(e.target.value)}
                  data-testid="input-upload-comment"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9"
                  onClick={handleAddEntry}
                  disabled={!resolvedUploadDocType || !uploadFileName}
                  data-testid="button-add-entry"
                >
                  Agregar
                </Button>
              </div>
            </div>

            {stagedEntries.length > 0 && (
              <>
                <Separator />
                <div className="space-y-1.5" data-testid="staged-files-list">
                  <p className="text-xs font-medium text-muted-foreground">{stagedEntries.length} archivo{stagedEntries.length !== 1 ? "s" : ""} listo{stagedEntries.length !== 1 ? "s" : ""}</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {stagedEntries.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 py-1.5 px-2 rounded hover:bg-muted/50 group" data-testid={`staged-entry-${idx}`}>
                        <div className="min-w-0 flex-1 flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex-shrink-0">{entry.docType}</Badge>
                          <span className="text-xs" title={entry.fileName}>{shortenFileName(entry.fileName)}</span>
                          {entry.comment && (
                            <span className="text-[10px] text-muted-foreground truncate hidden sm:inline">— {entry.comment}</span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setStagedEntries((prev) => prev.filter((_, i) => i !== idx))}
                          data-testid={`button-remove-staged-${idx}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)} data-testid="button-cancel-upload">
              Cancelar
            </Button>
            <Button onClick={handleConfirmUpload} disabled={stagedEntries.length === 0} data-testid="button-confirm-upload">
              <UploadCloud className="h-4 w-4 mr-2" />
              Subir {stagedEntries.length > 0 ? `${stagedEntries.length} archivo${stagedEntries.length !== 1 ? "s" : ""}` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
