import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Plus,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { NewInfoAlert } from "@/components/new-info-alert";
import { EmptyState } from "@/components/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMockData } from "@/lib/mock-data";
import { ProcessStatus } from "@shared/schema";
import { useState } from "react";

const newProcessSchema = z.object({
  name: z.string().min(1, "El nombre del proceso es requerido"),
  year: z.coerce.number().min(2000, "Año inválido").max(2100, "Año inválido"),
});

type NewProcessForm = z.infer<typeof newProcessSchema>;

export default function TaxpayerFile() {
  const [, params] = useRoute("/taxpayers/:id");
  const taxpayerId = params?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getTaxpayerWithProcess, getProcessesForTaxpayer, addProcess } = useMockData();

  const taxpayer = taxpayerId ? getTaxpayerWithProcess(taxpayerId) : undefined;
  const processes = taxpayerId ? getProcessesForTaxpayer(taxpayerId) : [];

  const form = useForm<NewProcessForm>({
    resolver: zodResolver(newProcessSchema),
    defaultValues: {
      name: "",
      year: new Date().getFullYear(),
    },
  });

  const onSubmit = (data: NewProcessForm) => {
    if (!taxpayerId) return;
    
    addProcess({
      taxpayerId,
      name: data.name,
      year: data.year,
      status: ProcessStatus.PENDING_REVIEW,
      feedbackComment: null,
      hasNewInfo: "false",
      isLocked: "false",
    });

    toast({
      title: "Proceso creado",
      description: "El nuevo proceso de devolución ha sido creado exitosamente.",
    });
    form.reset();
    setDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!taxpayer) {
    return (
      <div className="space-y-6">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <EmptyState
          icon="users"
          title="Contribuyente no encontrado"
          description="El contribuyente que buscas no existe o ha sido eliminado."
          action={
            <Link href="/">
              <Button>Ir al Dashboard</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-taxpayer-name">
            {taxpayer.name}
          </h1>
          <p className="text-muted-foreground font-mono">{taxpayer.rfc}</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil del Contribuyente</CardTitle>
          <CardDescription>Datos maestros y contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials(taxpayer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{taxpayer.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">{taxpayer.rfc}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden md:block h-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Régimen Fiscal</p>
                  <p className="text-sm font-medium" data-testid="text-regime">{taxpayer.regime}</p>
                </div>
              </div>
              {taxpayer.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium" data-testid="text-email">{taxpayer.email}</p>
                  </div>
                </div>
              )}
              {taxpayer.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium" data-testid="text-phone">{taxpayer.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Timeline */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Línea de Vida de Procesos</CardTitle>
              <CardDescription>
                Historial cronológico de todos los procesos de devolución
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-process">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proceso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Proceso</DialogTitle>
                  <DialogDescription>
                    Inicia un nuevo proceso de devolución de impuestos para este contribuyente.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Proceso</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Ejercicio 2024, Complementaria Mayo..."
                              data-testid="input-process-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Año Fiscal</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2024"
                              data-testid="input-process-year"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit" data-testid="button-submit-process">
                        Crear Proceso
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!processes.length ? (
            <EmptyState
              icon="folder"
              title="Sin procesos"
              description="Este contribuyente aún no tiene procesos de devolución. Crea uno para comenzar."
              action={
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Proceso
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {processes
                .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                .map((process) => (
                  <Link key={process.id} href={`/processes/${process.id}`}>
                    <div
                      className="flex items-center gap-4 p-4 border rounded-lg hover-elevate cursor-pointer"
                      data-testid={`card-process-${process.id}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{process.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {process.year}
                          </Badge>
                          <NewInfoAlert show={process.hasNewInfo === "true"} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Creado {format(new Date(process.createdAt!), "dd MMM yyyy", { locale: es })}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={process.status as any} size="sm" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
