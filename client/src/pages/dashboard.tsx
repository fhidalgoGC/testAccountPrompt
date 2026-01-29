import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Plus, ChevronRight, Users, FileText, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { NewInfoAlert } from "@/components/new-info-alert";
import { EmptyState } from "@/components/empty-state";
import { useMockData } from "@/lib/mock-data";
import { useState } from "react";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const { taxpayers, getTaxpayerWithProcess, getStats } = useMockData();

  const stats = getStats();

  const taxpayersWithProcess = taxpayers.map((t) => getTaxpayerWithProcess(t.id)!);

  const filteredTaxpayers = taxpayersWithProcess.filter(
    (t) =>
      t.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Vista general de contribuyentes y procesos activos
          </p>
        </div>
        <Link href="/taxpayers/new">
          <Button data-testid="button-new-taxpayer">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Contribuyente
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contribuyentes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-taxpayers">
              {stats.totalTaxpayers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Procesos Activos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-processes">
              {stats.activeProcesses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes de Revisión
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-pending-review">
              {stats.pendingReview}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="text-completed">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taxpayers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Gestión de Contribuyentes</CardTitle>
              <CardDescription>
                Lista de todos los contribuyentes y sus procesos activos
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por RFC o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-taxpayers"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!filteredTaxpayers.length ? (
            <EmptyState
              icon="users"
              title="Sin contribuyentes"
              description="No hay contribuyentes registrados. Comienza agregando un nuevo contribuyente."
              action={
                <Link href="/taxpayers/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Contribuyente
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-36">RFC</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="w-32">Proceso Activo</TableHead>
                    <TableHead className="w-40">Última Carga</TableHead>
                    <TableHead className="w-44">Estado</TableHead>
                    <TableHead className="w-32">Info Nueva</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaxpayers.map((taxpayer) => (
                    <TableRow
                      key={taxpayer.id}
                      className="hover-elevate cursor-pointer"
                      data-testid={`row-taxpayer-${taxpayer.id}`}
                    >
                      <TableCell className="font-mono font-medium">
                        <Link href={`/taxpayers/${taxpayer.id}`}>
                          <span className="text-primary hover:underline" data-testid={`link-rfc-${taxpayer.id}`}>
                            {taxpayer.rfc}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{taxpayer.name}</TableCell>
                      <TableCell>
                        {taxpayer.activeProcess ? (
                          <span className="text-sm">{taxpayer.activeProcess.name}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {taxpayer.lastUploadDate
                          ? format(new Date(taxpayer.lastUploadDate), "dd MMM yyyy", { locale: es })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {taxpayer.activeProcess ? (
                          <StatusBadge status={taxpayer.activeProcess.status as any} size="sm" />
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin proceso</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <NewInfoAlert show={taxpayer.activeProcess?.hasNewInfo === "true"} />
                      </TableCell>
                      <TableCell>
                        <Link href={`/taxpayers/${taxpayer.id}`}>
                          <Button variant="ghost" size="icon" data-testid={`button-view-${taxpayer.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
