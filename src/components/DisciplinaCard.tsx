import { useSchool } from '../contexts/SchoolContext';
import { Disciplina } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, Users, UserCog, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';

interface DisciplinaCardProps {
  disciplina: Disciplina;
  onManageGrades: (disciplina: Disciplina) => void;
  onViewAlunos: (disciplina: Disciplina) => void;
  onDelete: (codigo: number) => void;
}

export function DisciplinaCard({ disciplina, onManageGrades, onViewAlunos, onDelete }: DisciplinaCardProps) {
  const { professores, alunos } = useSchool();
  
  const professor = professores.find(p => p.ID === disciplina.professorId);
  const disciplinaAlunos = alunos.filter(a => disciplina.alunosIds.includes(a.ID));

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 flex-shrink-0" />
              <span className="break-words">{disciplina.nome}</span>
            </CardTitle>
            <Badge variant="outline" className="w-fit mt-2">Código: {disciplina.codigo}</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(disciplina.codigo)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-2 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <UserCog className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Professor:</span>
            <span>{professor?.nome || 'Não atribuído'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Alunos matriculados:</span>
            <Badge variant="secondary">{disciplinaAlunos.length}</Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewAlunos(disciplina)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Alunos
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onManageGrades(disciplina)}
            className="flex-1"
            disabled={!professor || disciplinaAlunos.length === 0}
          >
            <Edit className="h-4 w-4 mr-2" />
            Gerenciar Notas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}