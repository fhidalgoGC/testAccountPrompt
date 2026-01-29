import { Link } from "wouter";
import { Search, Plus, ChevronRight, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { NewInfoAlert } from "@/components/new-info-alert";
import { EmptyState } from "@/components/empty-state";
import { useMockData } from "@/lib/mock-data";
import { useState } from "react";

export default function TaxpayersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { taxpayers, getTaxpayerWithProcess } = useMockData();

  const taxpayersWithProcess = taxpayers.map((t) => getTaxpayerWithProcess(t.id)!);

  const filteredTaxpayers = taxpayersWithProcess.filter(
    (t) =>
      t.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="text-title">
            Contribuyentes
          </h1>
          <p className="text-muted-foreground">
            Gestiona todos los clientes y sus expedientes
          </p>
        </div>
        <Link href="/taxpayers/new">
          <Button data-testid="button-new-taxpayer">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Contribuyente
          </Button>
        </Link>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por RFC o nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      {!filteredTaxpayers.length ? (
        <EmptyState
          icon="users"
          title={searchTerm ? "Sin resultados" : "Sin contribuyentes"}
          description={
            searchTerm
              ? "No se encontraron contribuyentes que coincidan con tu búsqueda."
              : "No hay contribuyentes registrados. Comienza agregando un nuevo contribuyente."
          }
          action={
            !searchTerm ? (
              <Link href="/taxpayers/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Contribuyente
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTaxpayers.map((taxpayer) => (
            <Link key={taxpayer.id} href={`/taxpayers/${taxpayer.id}`}>
              <Card
                className="hover-elevate cursor-pointer h-full"
                data-testid={`card-taxpayer-${taxpayer.id}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(taxpayer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{taxpayer.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{taxpayer.rfc}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{taxpayer.regime}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>

                  {taxpayer.activeProcess && (
                    <>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-xs text-muted-foreground">Proceso activo</p>
                            <p className="text-sm font-medium">{taxpayer.activeProcess.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <NewInfoAlert show={taxpayer.activeProcess.hasNewInfo === "true"} />
                            <StatusBadge
                              status={taxpayer.activeProcess.status as any}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
