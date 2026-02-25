import { createContext, useContext, useState, type ReactNode } from "react";
import { type Taxpayer, type Process, type Upload, type XmlFile, type AuditLogEntry, ProcessStatus } from "@shared/schema";

// Generate unique IDs
let idCounter = 100;
const generateId = () => `id-${idCounter++}`;

// Initial mock taxpayers
const initialTaxpayers: Taxpayer[] = [
  {
    id: "tp-1",
    rfc: "ABC123456789",
    name: "Comercializadora del Norte S.A. de C.V.",
    regime: "601 - General de Ley Personas Morales",
    email: "contacto@comercializadora.com",
    phone: "55 1234 5678",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "tp-2",
    rfc: "XYZ987654321",
    name: "Servicios Profesionales González",
    regime: "612 - Personas Físicas con Actividades Empresariales",
    email: "info@spgonzalez.com",
    phone: "33 9876 5432",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "tp-3",
    rfc: "DEF456789012",
    name: "Industrias Alimenticias del Bajío",
    regime: "601 - General de Ley Personas Morales",
    email: "admin@iabajio.mx",
    phone: "477 123 4567",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "tp-4",
    rfc: "MAMJ850101XXX",
    name: "María Martínez Jiménez",
    regime: "626 - Régimen Simplificado de Confianza",
    email: "maria.mtz@email.com",
    phone: "55 5555 1234",
    createdAt: new Date("2024-04-05"),
  },
];

// Initial mock processes
const initialProcesses: Process[] = [
  {
    id: "pr-1",
    taxpayerId: "tp-1",
    name: "Ejercicio 2024",
    year: 2024,
    status: ProcessStatus.PENDING_REVIEW,
    feedbackComment: null,
    hasNewInfo: "true",
    isLocked: "false",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-15"),
  },
  {
    id: "pr-2",
    taxpayerId: "tp-1",
    name: "Complementaria Enero 2024",
    year: 2024,
    status: ProcessStatus.FINALIZED,
    feedbackComment: null,
    hasNewInfo: "false",
    isLocked: "true",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "pr-3",
    taxpayerId: "tp-2",
    name: "Ejercicio 2024",
    year: 2024,
    status: ProcessStatus.INCOMPLETE,
    feedbackComment: "Faltan los XMLs de nóminas del mes de abril y mayo. Por favor subir los comprobantes faltantes.",
    hasNewInfo: "false",
    isLocked: "false",
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "pr-4",
    taxpayerId: "tp-3",
    name: "Ejercicio 2023",
    year: 2023,
    status: ProcessStatus.IN_REVIEW,
    feedbackComment: null,
    hasNewInfo: "false",
    isLocked: "false",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-10"),
  },
];

// Initial mock uploads
const initialUploads: Upload[] = [
  {
    id: "up-1",
    processId: "pr-1",
    uploadNumber: 1,
    createdAt: new Date("2024-06-01T10:30:00"),
  },
  {
    id: "up-2",
    processId: "pr-1",
    uploadNumber: 2,
    createdAt: new Date("2024-06-15T14:45:00"),
  },
  {
    id: "up-3",
    processId: "pr-3",
    uploadNumber: 1,
    createdAt: new Date("2024-05-10T09:00:00"),
  },
  {
    id: "up-4",
    processId: "pr-4",
    uploadNumber: 1,
    createdAt: new Date("2024-01-20T11:00:00"),
  },
  {
    id: "up-5",
    processId: "pr-4",
    uploadNumber: 2,
    createdAt: new Date("2024-02-05T16:30:00"),
  },
];

// Initial mock XML files
const initialXmlFiles: XmlFile[] = [
  // Files for upload 1 (pr-1)
  {
    id: "xml-1",
    uploadId: "up-1",
    processId: "pr-1",
    uuid: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
    fileName: "factura_001.xml",
    issuerRfc: "PRO123456789",
    receiverRfc: "ABC123456789",
    amount: "15000.00",
    issueDate: "2024-01-15",
    createdAt: new Date("2024-06-01T10:30:00"),
  },
  {
    id: "xml-2",
    uploadId: "up-1",
    processId: "pr-1",
    uuid: "B2C3D4E5-F6A7-8901-BCDE-F12345678901",
    fileName: "factura_002.xml",
    issuerRfc: "SER987654321",
    receiverRfc: "ABC123456789",
    amount: "8500.50",
    issueDate: "2024-02-20",
    createdAt: new Date("2024-06-01T10:30:00"),
  },
  {
    id: "xml-3",
    uploadId: "up-1",
    processId: "pr-1",
    uuid: "C3D4E5F6-A7B8-9012-CDEF-123456789012",
    fileName: "factura_003.xml",
    issuerRfc: "TEC456789012",
    receiverRfc: "ABC123456789",
    amount: "22300.00",
    issueDate: "2024-03-10",
    createdAt: new Date("2024-06-01T10:30:00"),
  },
  // Files for upload 2 (pr-1) - includes one duplicate
  {
    id: "xml-4",
    uploadId: "up-2",
    processId: "pr-1",
    uuid: "D4E5F6A7-B8C9-0123-DEFA-234567890123",
    fileName: "factura_004.xml",
    issuerRfc: "LOG789012345",
    receiverRfc: "ABC123456789",
    amount: "5600.00",
    issueDate: "2024-04-05",
    createdAt: new Date("2024-06-15T14:45:00"),
  },
  {
    id: "xml-5",
    uploadId: "up-2",
    processId: "pr-1",
    uuid: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", // Duplicate of xml-1
    fileName: "factura_001_dup.xml",
    issuerRfc: "PRO123456789",
    receiverRfc: "ABC123456789",
    amount: "15000.00",
    issueDate: "2024-01-15",
    createdAt: new Date("2024-06-15T14:45:00"),
  },
  {
    id: "xml-6",
    uploadId: "up-2",
    processId: "pr-1",
    uuid: "E5F6A7B8-C9D0-1234-EFAB-345678901234",
    fileName: "factura_005.xml",
    issuerRfc: "MAN012345678",
    receiverRfc: "ABC123456789",
    amount: "12750.25",
    issueDate: "2024-05-18",
    createdAt: new Date("2024-06-15T14:45:00"),
  },
  // Files for upload 3 (pr-3)
  {
    id: "xml-7",
    uploadId: "up-3",
    processId: "pr-3",
    uuid: "F6A7B8C9-D0E1-2345-FABC-456789012345",
    fileName: "recibo_nomina_enero.xml",
    issuerRfc: "XYZ987654321",
    receiverRfc: "EMP111222333",
    amount: "18500.00",
    issueDate: "2024-01-31",
    createdAt: new Date("2024-05-10T09:00:00"),
  },
  {
    id: "xml-8",
    uploadId: "up-3",
    processId: "pr-3",
    uuid: "A7B8C9D0-E1F2-3456-ABCD-567890123456",
    fileName: "recibo_nomina_febrero.xml",
    issuerRfc: "XYZ987654321",
    receiverRfc: "EMP111222333",
    amount: "18500.00",
    issueDate: "2024-02-29",
    createdAt: new Date("2024-05-10T09:00:00"),
  },
  // Files for uploads in pr-4
  {
    id: "xml-9",
    uploadId: "up-4",
    processId: "pr-4",
    uuid: "B8C9D0E1-F2A3-4567-BCDE-678901234567",
    fileName: "compra_materia_prima.xml",
    issuerRfc: "MAT345678901",
    receiverRfc: "DEF456789012",
    amount: "45000.00",
    issueDate: "2023-03-15",
    createdAt: new Date("2024-01-20T11:00:00"),
  },
  {
    id: "xml-10",
    uploadId: "up-5",
    processId: "pr-4",
    uuid: "C9D0E1F2-A3B4-5678-CDEF-789012345678",
    fileName: "servicios_transporte.xml",
    issuerRfc: "TRA456789012",
    receiverRfc: "DEF456789012",
    amount: "8200.00",
    issueDate: "2023-06-20",
    createdAt: new Date("2024-02-05T16:30:00"),
  },
  {
    id: "xml-11",
    uploadId: "up-5",
    processId: "pr-4",
    uuid: "D0E1F2A3-B4C5-6789-DEFA-890123456789",
    fileName: "renta_bodega.xml",
    issuerRfc: "INM567890123",
    receiverRfc: "DEF456789012",
    amount: "35000.00",
    issueDate: "2023-08-01",
    createdAt: new Date("2024-02-05T16:30:00"),
  },
];

const initialAuditLog: AuditLogEntry[] = [
  {
    id: "al-1",
    processId: "pr-1",
    action: "status_change",
    previousStatus: ProcessStatus.PENDING_REVIEW,
    newStatus: ProcessStatus.IN_REVIEW,
    feedbackComment: null,
    uploadedFiles: null,
    requestedDocTypes: null,
    createdAt: new Date("2024-06-05T10:00:00"),
  },
  {
    id: "al-2",
    processId: "pr-1",
    action: "status_change",
    previousStatus: ProcessStatus.IN_REVIEW,
    newStatus: ProcessStatus.INCOMPLETE,
    feedbackComment: "Faltan facturas del proveedor LOG789012345 correspondientes al mes de marzo.",
    uploadedFiles: null,
    requestedDocTypes: ["Facturas de Ingreso", "Complementos de Pago"],
    createdAt: new Date("2024-06-08T15:30:00"),
  },
  {
    id: "al-2b",
    processId: "pr-1",
    action: "upload",
    previousStatus: null,
    newStatus: null,
    feedbackComment: null,
    uploadedFiles: ["factura_004.xml", "factura_001_dup.xml", "factura_005.xml"],
    requestedDocTypes: null,
    createdAt: new Date("2024-06-15T14:45:00"),
  },
  {
    id: "al-3",
    processId: "pr-1",
    action: "status_change",
    previousStatus: ProcessStatus.INCOMPLETE,
    newStatus: ProcessStatus.PENDING_REVIEW,
    feedbackComment: null,
    uploadedFiles: null,
    requestedDocTypes: null,
    createdAt: new Date("2024-06-15T14:50:00"),
  },
  {
    id: "al-4",
    processId: "pr-3",
    action: "status_change",
    previousStatus: ProcessStatus.PENDING_REVIEW,
    newStatus: ProcessStatus.IN_REVIEW,
    feedbackComment: null,
    uploadedFiles: null,
    requestedDocTypes: null,
    createdAt: new Date("2024-05-15T09:00:00"),
  },
  {
    id: "al-5",
    processId: "pr-3",
    action: "status_change",
    previousStatus: ProcessStatus.IN_REVIEW,
    newStatus: ProcessStatus.INCOMPLETE,
    feedbackComment: "Faltan los XMLs de nóminas del mes de abril y mayo. Por favor subir los comprobantes faltantes.",
    uploadedFiles: null,
    requestedDocTypes: ["Recibos de Nómina", "Retenciones"],
    createdAt: new Date("2024-06-01T11:00:00"),
  },
  {
    id: "al-6",
    processId: "pr-4",
    action: "status_change",
    previousStatus: ProcessStatus.PENDING_REVIEW,
    newStatus: ProcessStatus.IN_REVIEW,
    feedbackComment: null,
    uploadedFiles: null,
    requestedDocTypes: null,
    createdAt: new Date("2024-02-10T14:00:00"),
  },
  {
    id: "al-7",
    processId: "pr-2",
    action: "status_change",
    previousStatus: ProcessStatus.PENDING_REVIEW,
    newStatus: ProcessStatus.IN_REVIEW,
    feedbackComment: null,
    uploadedFiles: null,
    requestedDocTypes: null,
    createdAt: new Date("2024-02-20T10:00:00"),
  },
  {
    id: "al-8",
    processId: "pr-2",
    action: "status_change",
    previousStatus: ProcessStatus.IN_REVIEW,
    newStatus: ProcessStatus.FINALIZED,
    feedbackComment: null,
    uploadedFiles: null,
    requestedDocTypes: null,
    createdAt: new Date("2024-03-20T16:00:00"),
  },
];

interface MockDataContextType {
  taxpayers: Taxpayer[];
  processes: Process[];
  uploads: Upload[];
  xmlFiles: XmlFile[];
  auditLog: AuditLogEntry[];
  addTaxpayer: (data: Omit<Taxpayer, "id" | "createdAt">) => Taxpayer;
  addProcess: (data: Omit<Process, "id" | "createdAt" | "updatedAt">) => Process;
  updateProcessStatus: (processId: string, status: string, feedbackComment?: string, requestedDocTypes?: string[]) => void;
  finalizeProcess: (processId: string) => void;
  clearNewInfoFlag: (processId: string) => void;
  simulateUpload: (processId: string, fileNames: string[]) => void;
  getTaxpayerWithProcess: (taxpayerId: string) => Taxpayer & { activeProcess?: Process; lastUploadDate?: Date } | undefined;
  getProcessesForTaxpayer: (taxpayerId: string) => Process[];
  getProcessDetail: (processId: string) => {
    process: Process;
    taxpayer: Taxpayer;
    uploads: (Upload & { files: XmlFile[] })[];
    uniqueFilesCount: number;
    totalFilesCount: number;
  } | undefined;
  getAuditLog: (processId: string) => AuditLogEntry[];
  getRequestedDocTypes: (processId: string) => string[];
  getStats: () => {
    totalTaxpayers: number;
    activeProcesses: number;
    pendingReview: number;
    completed: number;
  };
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>(initialTaxpayers);
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [uploads, setUploads] = useState<Upload[]>(initialUploads);
  const [xmlFiles, setXmlFiles] = useState<XmlFile[]>(initialXmlFiles);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(initialAuditLog);

  const addTaxpayer = (data: Omit<Taxpayer, "id" | "createdAt">) => {
    const newTaxpayer: Taxpayer = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
    };
    setTaxpayers((prev) => [...prev, newTaxpayer]);
    return newTaxpayer;
  };

  const addProcess = (data: Omit<Process, "id" | "createdAt" | "updatedAt">) => {
    const newProcess: Process = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProcesses((prev) => [...prev, newProcess]);
    return newProcess;
  };

  const updateProcessStatus = (processId: string, status: string, feedbackComment?: string, requestedDocTypes?: string[]) => {
    const currentProcess = processes.find((p) => p.id === processId);
    if (currentProcess && currentProcess.status !== status) {
      setAuditLog((prev) => [
        ...prev,
        {
          id: generateId(),
          processId,
          action: "status_change" as const,
          previousStatus: currentProcess.status,
          newStatus: status,
          feedbackComment: feedbackComment || null,
          uploadedFiles: null,
          requestedDocTypes: requestedDocTypes && requestedDocTypes.length > 0 ? requestedDocTypes : null,
          createdAt: new Date(),
        },
      ]);
    }
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === processId
          ? {
              ...p,
              status,
              feedbackComment: feedbackComment || p.feedbackComment,
              hasNewInfo: "false",
              updatedAt: new Date(),
            }
          : p
      )
    );
  };

  const finalizeProcess = (processId: string) => {
    const currentProcess = processes.find((p) => p.id === processId);
    if (currentProcess) {
      setAuditLog((prev) => [
        ...prev,
        {
          id: generateId(),
          processId,
          action: "status_change" as const,
          previousStatus: currentProcess.status,
          newStatus: ProcessStatus.FINALIZED,
          feedbackComment: null,
          uploadedFiles: null,
          requestedDocTypes: null,
          createdAt: new Date(),
        },
      ]);
    }
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === processId
          ? {
              ...p,
              status: ProcessStatus.FINALIZED,
              isLocked: "true",
              hasNewInfo: "false",
              updatedAt: new Date(),
            }
          : p
      )
    );
  };

  const simulateUpload = (processId: string, fileNames: string[]) => {
    const processUploads = uploads.filter((u) => u.processId === processId);
    const nextUploadNumber = processUploads.length > 0
      ? Math.max(...processUploads.map((u) => u.uploadNumber)) + 1
      : 1;

    const uploadId = generateId();
    const newUpload: Upload = {
      id: uploadId,
      processId,
      uploadNumber: nextUploadNumber,
      createdAt: new Date(),
    };
    setUploads((prev) => [...prev, newUpload]);

    const newFiles: XmlFile[] = fileNames.map((fileName) => ({
      id: generateId(),
      uploadId,
      processId,
      uuid: `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      fileName,
      issuerRfc: null,
      receiverRfc: null,
      amount: null,
      issueDate: null,
      createdAt: new Date(),
    }));
    setXmlFiles((prev) => [...prev, ...newFiles]);

    setAuditLog((prev) => [
      ...prev,
      {
        id: generateId(),
        processId,
        action: "upload" as const,
        previousStatus: null,
        newStatus: null,
        feedbackComment: null,
        uploadedFiles: fileNames,
        requestedDocTypes: null,
        createdAt: new Date(),
      },
    ]);

    setProcesses((prev) =>
      prev.map((p) =>
        p.id === processId
          ? { ...p, hasNewInfo: "true", updatedAt: new Date() }
          : p
      )
    );
  };

  const clearNewInfoFlag = (processId: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === processId ? { ...p, hasNewInfo: "false" } : p
      )
    );
  };

  const getTaxpayerWithProcess = (taxpayerId: string) => {
    const taxpayer = taxpayers.find((t) => t.id === taxpayerId);
    if (!taxpayer) return undefined;

    const taxpayerProcesses = processes
      .filter((p) => p.taxpayerId === taxpayerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    const activeProcess = taxpayerProcesses.find((p) => p.isLocked !== "true");

    const taxpayerUploads = uploads.filter((u) =>
      taxpayerProcesses.some((p) => p.id === u.processId)
    );
    const lastUpload = taxpayerUploads.sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )[0];

    return {
      ...taxpayer,
      activeProcess,
      lastUploadDate: lastUpload?.createdAt,
    };
  };

  const getProcessesForTaxpayer = (taxpayerId: string) => {
    return processes.filter((p) => p.taxpayerId === taxpayerId);
  };

  const getProcessDetail = (processId: string) => {
    const process = processes.find((p) => p.id === processId);
    if (!process) return undefined;

    const taxpayer = taxpayers.find((t) => t.id === process.taxpayerId);
    if (!taxpayer) return undefined;

    const processUploads = uploads
      .filter((u) => u.processId === processId)
      .map((upload) => ({
        ...upload,
        files: xmlFiles.filter((f) => f.uploadId === upload.id),
      }));

    const allFiles = xmlFiles.filter((f) => f.processId === processId);
    const uniqueUuids = new Set(allFiles.map((f) => f.uuid));

    return {
      process,
      taxpayer,
      uploads: processUploads,
      uniqueFilesCount: uniqueUuids.size,
      totalFilesCount: allFiles.length,
    };
  };

  const getAuditLog = (processId: string) => {
    return auditLog
      .filter((entry) => entry.processId === processId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getRequestedDocTypes = (processId: string) => {
    const allRequested = auditLog
      .filter((entry) => entry.processId === processId && entry.requestedDocTypes && entry.requestedDocTypes.length > 0)
      .flatMap((entry) => entry.requestedDocTypes || []);
    return [...new Set(allRequested)];
  };

  const getStats = () => {
    return {
      totalTaxpayers: taxpayers.length,
      activeProcesses: processes.filter((p) => p.isLocked !== "true").length,
      pendingReview: processes.filter((p) => p.status === ProcessStatus.PENDING_REVIEW).length,
      completed: processes.filter((p) => p.status === ProcessStatus.FINALIZED).length,
    };
  };

  return (
    <MockDataContext.Provider
      value={{
        taxpayers,
        processes,
        uploads,
        xmlFiles,
        auditLog,
        addTaxpayer,
        addProcess,
        updateProcessStatus,
        finalizeProcess,
        clearNewInfoFlag,
        simulateUpload,
        getTaxpayerWithProcess,
        getProcessesForTaxpayer,
        getProcessDetail,
        getAuditLog,
        getRequestedDocTypes,
        getStats,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
