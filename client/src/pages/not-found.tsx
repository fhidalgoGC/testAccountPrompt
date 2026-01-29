import { Link } from "wouter";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.
      </p>
      <Link href="/">
        <Button data-testid="button-go-home">
          <Home className="h-4 w-4 mr-2" />
          Ir al Dashboard
        </Button>
      </Link>
    </div>
  );
}
