import { useSchool } from '../contexts/SchoolContext';
import { Aluno } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, BookOpen, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface AlunoCardProps {
  aluno: Aluno;
  onDelete: (id: number) => void;
}

export function AlunoCard({ aluno, onDelete }: AlunoCardProps) {
  const { disciplinas } = useSchool();

  const alunosDisciplinas = disciplinas.filter(d => 
    aluno.disciplinas.includes(d.codigo)
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 flex-shrink-0" />
            <span className="break-words">{aluno.nome}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(aluno.ID)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-2 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">CPF:</span>
            <span className="break-all">{aluno.cpf}</span>
          </div>
          
          {aluno.numeroMatricula && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">Matrícula: {aluno.numeroMatricula}</Badge>
            </div>
          )}

          {aluno.dataNascimento && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Nascimento:</span>
              <span>{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</span>
              <span className="text-muted-foreground">({aluno.idade} anos)</span>
            </div>
          )}

          {aluno.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{aluno.email}</span>
            </div>
          )}

          {aluno.telefone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{aluno.telefone}</span>
            </div>
          )}

          {aluno.endereco.cidade && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{aluno.endereco.cidade}/{aluno.endereco.estado}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">Disciplinas ({alunosDisciplinas.length})</span>
          </div>
          <div className="space-y-2">
            {alunosDisciplinas.map(disc => {
              const nota = aluno.notas[disc.codigo];
              return (
                <div
                  key={disc.codigo}
                  className="flex items-center justify-between gap-2 text-sm bg-muted p-2 rounded"
                >
                  <span className="truncate flex-1">{disc.nome}</span>
                  {nota !== undefined && (
                    <Badge variant={nota >= 7 ? 'default' : 'destructive'} className="flex-shrink-0">
                      {nota.toFixed(1)}
                    </Badge>
                  )}
                </div>
              );
            })}
            {alunosDisciplinas.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma disciplina matriculada
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}