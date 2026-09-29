import AdminContentManager from './AdminContentManager';
import { STORAGE_PATHS } from '@/lib/constants';

export function AdminProjects() {
  return (
    <AdminContentManager
      config={{
        table: 'projects',
        title: 'Projects Repository',
        subtitle: 'Manage digital twin assemblies, CAD prototypes, and engineering project showcases.',
        sectorBadge: 'PROJECTS',
        storagePath: STORAGE_PATHS.projects,
        hasSoftware: true,
        hasDomain: true,
      }}
    />
  );
}

export function AdminCadCae() {
  return (
    <AdminContentManager
      config={{
        table: 'cad_cae',
        title: 'CAD & CAE Simulations',
        subtitle: 'Maintain structural FEA models, mesh independence tests, and computational analyses.',
        sectorBadge: 'CAD / CAE',
        storagePath: STORAGE_PATHS.cadCae,
        hasSoftware: true,
        hasDomain: true,
      }}
    />
  );
}

export function AdminResearch() {
  return (
    <AdminContentManager
      config={{
        table: 'research',
        title: 'Laboratory Research & Publications',
        subtitle: 'Manage scientific papers, continuum mechanics models, and conference submissions.',
        sectorBadge: 'RESEARCH',
        storagePath: STORAGE_PATHS.research,
        hasSoftware: true,
        hasStatus: true,
      }}
    />
  );
}

export function AdminPlc() {
  return (
    <AdminContentManager
      config={{
        table: 'plc_programs',
        title: 'PLC Programs & Industrial Automation',
        subtitle: 'Manage ladder logic, structured text routines, and robotic mechatronic controls.',
        sectorBadge: 'AUTOMATION',
        storagePath: STORAGE_PATHS.plc,
        hasSoftware: true,
      }}
    />
  );
}

export function AdminCertifications() {
  return (
    <AdminContentManager
      config={{
        table: 'certifications',
        title: 'Certifications & Accreditations',
        subtitle: 'Manage formal verified credentials, issuing authorities, and PDF certificate files.',
        sectorBadge: 'ACCREDITATIONS',
        storagePath: STORAGE_PATHS.certificates,
        hasCertFields: true,
      }}
    />
  );
}

export function AdminSkills() {
  return (
    <AdminContentManager
      config={{
        table: 'skills',
        title: 'Engineering Skills Arsenal',
        subtitle: 'Manage technical competencies, software tool mastery, and proficiency percentages.',
        sectorBadge: 'SKILLS',
        storagePath: STORAGE_PATHS.media,
        hasProficiency: true,
      }}
    />
  );
}

export function AdminArticles() {
  return (
    <AdminContentManager
      config={{
        table: 'articles',
        title: 'Articles & Technical Publications',
        subtitle: 'Draft, publish, and manage engineering essays, guides, and simulation logs.',
        sectorBadge: 'ARTICLES',
        storagePath: STORAGE_PATHS.articles,
      }}
    />
  );
}

export function AdminConnections() {
  return (
    <AdminContentManager
      config={{
        table: 'connections',
        title: 'Professional Connections',
        subtitle: 'Manage verified nodes for LinkedIn, GitHub, ORCID, and research platforms.',
        sectorBadge: 'CONNECTIONS',
        storagePath: STORAGE_PATHS.media,
        hasConnectionFields: true,
      }}
    />
  );
}

export function AdminAiEngineering() {
  return (
    <AdminContentManager
      config={{
        table: 'ai_engineering',
        title: 'AI × Engineering Implementations',
        subtitle: 'Manage physics-informed neural networks (PINNs), simulation surrogate models, and automated engineering pipelines.',
        sectorBadge: 'AI × ENGINEERING',
        storagePath: STORAGE_PATHS.projects,
        hasSoftware: true,
        hasDomain: true,
      }}
    />
  );
}

export function AdminCertificateFiles() {
  return (
    <AdminContentManager
      config={{
        table: 'certifications',
        title: 'Certificate Document Files',
        subtitle: 'Upload, verify, and inspect formal accreditation credentials and PDF certificate documents.',
        sectorBadge: 'CREDENTIAL FILES',
        storagePath: STORAGE_PATHS.certificates,
        hasCertFields: true,
      }}
    />
  );
}

