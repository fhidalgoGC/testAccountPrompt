import { useLocation, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMockData } from "@/lib/mock-data";

const taxpayerFormSchema = z.object({
  rfc: z
    .string()
    .min(12, "El RFC debe tener al menos 12 caracteres")
    .max(13, "El RFC no puede tener más de 13 caracteres")
    .regex(/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/i, "Formato de RFC inválido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  regime: z.string().min(1, "Selecciona un régimen fiscal"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
});

type TaxpayerFormData = z.infer<typeof taxpayerFormSchema>;

const regimes = [
  { value: "601", label: "601 - General de Ley Personas Morales" },
  { value: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
  { value: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados" },
  { value: "606", label: "606 - Arrendamiento" },
  { value: "607", label: "607 - Régimen de Enajenación o Adquisición de Bienes" },
  { value: "608", label: "608 - Demás Ingresos" },
  { value: "610", label: "610 - Residentes en el Extranjero sin Establecimiento" },
  { value: "611", label: "611 - Ingresos por Dividendos" },
  { value: "612", label: "612 - Personas Físicas con Actividades Empresariales" },
  { value: "614", label: "614 - Ingresos por Intereses" },
  { value: "615", label: "615 - Régimen de Ingresos por Obtención de Premios" },
  { value: "616", label: "616 - Sin Obligaciones Fiscales" },
  { value: "620", label: "620 - Sociedades Cooperativas de Producción" },
  { value: "621", label: "621 - Incorporación Fiscal" },
  { value: "622", label: "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
  { value: "623", label: "623 - Opcional para Grupos de Sociedades" },
  { value: "624", label: "624 - Coordinados" },
  { value: "625", label: "625 - Régimen de las Actividades Empresariales (RIF)" },
  { value: "626", label: "626 - Régimen Simplificado de Confianza" },
];

export default function NewTaxpayer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addTaxpayer } = useMockData();

  const form = useForm<TaxpayerFormData>({
    resolver: zodResolver(taxpayerFormSchema),
    defaultValues: {
      rfc: "",
      name: "",
      regime: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: TaxpayerFormData) => {
    const newTaxpayer = addTaxpayer({
      rfc: data.rfc.toUpperCase(),
      name: data.name,
      regime: data.regime,
      email: data.email || null,
      phone: data.phone || null,
    });

    toast({
      title: "Contribuyente creado",
      description: "El nuevo contribuyente ha sido registrado exitosamente.",
    });
    
    setLocation(`/taxpayers/${newTaxpayer.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Nuevo Contribuyente</h1>
          <p className="text-muted-foreground">
            Registra un nuevo cliente para gestionar sus devoluciones
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Contribuyente</CardTitle>
          <CardDescription>
            Ingresa la información fiscal y de contacto del cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="rfc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RFC</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="XAXX010101000"
                          className="uppercase font-mono"
                          data-testid="input-rfc"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription>
                        12 caracteres para persona moral, 13 para física
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre o Razón Social</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Empresa S.A. de C.V."
                          data-testid="input-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="regime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Régimen Fiscal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-regime">
                          <SelectValue placeholder="Selecciona el régimen fiscal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regimes.map((regime) => (
                          <SelectItem key={regime.value} value={regime.label}>
                            {regime.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contacto@empresa.com"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="55 1234 5678"
                          data-testid="input-phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Link href="/">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" data-testid="button-submit">
                  Crear Contribuyente
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
