import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VectorInput, Vector } from "@/components/VectorInput";
import { VectorOperations } from "@/components/VectorOperations";
import { Vector3DCanvas } from "@/components/Vector3DCanvas";
import { VectorApplications } from "@/components/VectorApplications";
import { ProblemSolver } from "@/components/ProblemSolver";
import { CalculationHistory } from "@/components/CalculationHistory";
import { Calculator, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [vectors, setVectors] = useState<Vector[]>([
    {
      id: "1",
      x: 2,
      y: 3,
      z: 1,
      color: "#3b82f6",
      name: "v1",
    },
    {
      id: "2",
      x: -1,
      y: 2,
      z: 3,
      color: "#06b6d4",
      name: "v2",
    },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Calculator className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Calculadora de Vectores 3D
                </h1>
                <p className="text-sm text-muted-foreground">
                  Visualiza y opera con vectores en el espacio tridimensional
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-140px)]">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
            <VectorInput vectors={vectors} onVectorsChange={setVectors} />
            <VectorOperations vectors={vectors} />
            <CalculationHistory />
          </div>

          {/* Right Panel - 3D Visualization */}
          <div className="lg:col-span-2 rounded-lg overflow-hidden border border-border shadow-[var(--shadow-glow)]">
            <Vector3DCanvas vectors={vectors} />
          </div>
        </div>
      </main>

      {/* Problem Solver Section */}
      <ProblemSolver />

      {/* Applications Section */}
      <VectorApplications />
    </div>
  );
};

export default Index;
