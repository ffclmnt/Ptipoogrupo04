import { useSchool } from '../contexts/SchoolContext';
import { Professor } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { UserCog, BookOpen, Mail, Phone, MapPin, Trash2, Briefcase } from 'lucide-react';
import { Button } from './ui/button';

interface ProfessorCardProps {
  professor: Professor;
  onDelete: (id: number) => void;
}

export function ProfessorCard({ professor, onDelete }: ProfessorCardProps) {
  const { disciplinas } = useSchool();

  const professorDisciplinas = disciplinas.filter(d => 
    d.professorId === professor.ID
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 flex-shrink-0" />
            <span className="break-words">{professor.nome}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(professor.ID)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-2 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <UserCog className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">CPF:</span>
            <span className="break-all">{professor.cpf}</span>
          </div>

          {professor.numeroInstitucional && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">Nº Institucional: {professor.numeroInstitucional}</Badge>
            </div>
          )}

          {professor.departamento && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Depto:</span>
              <span>{professor.departamento}</span>
            </div>
          )}

          {professor.titulacao && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Titulação:</span>
              <Badge>{professor.titulacao}</Badge>
            </div>
          )}

          {professor.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{professor.email}</span>
            </div>
          )}

          {professor.telefone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{professor.telefone}</span>
            </div>
          )}

          {professor.endereco.cidade && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{professor.endereco.cidade}/{professor.endereco.estado}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">Disciplinas ({professorDisciplinas.length})</span>
          </div>
          <div className="space-y-2">
            {professorDisciplinas.map(disc => (
              <div
                key={disc.codigo}
                className="flex items-center justify-between gap-2 text-sm bg-muted p-2 rounded"
              >
                <span className="truncate flex-1">{disc.nome}</span>
                <Badge variant="outline" className="flex-shrink-0">{disc.alunosIds.length} alunos</Badge>
              </div>
            ))}
            {professorDisciplinas.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma disciplina atribuída
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}