import { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BookPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddDisciplinaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDisciplinaDialog({ open, onOpenChange }: AddDisciplinaDialogProps) {
  const { disciplinas, professores, adicionarDisciplina, atribuirProfessor } = useSchool();
  
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [professorId, setProfessorId] = useState('');

  const handleSubmit = () => {
    if (!nome || !codigo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const codigoNum = parseInt(codigo);
    if (disciplinas.some(d => d.codigo === codigoNum)) {
      toast.error('Já existe uma disciplina com este código');
      return;
    }

    adicionarDisciplina({
      codigo: codigoNum,
      nome,
      professorId: professorId ? parseInt(professorId) : undefined,
      alunosIds: [],
    });

    if (professorId) {
      atribuirProfessor(codigoNum, parseInt(professorId));
    }

    toast.success(`Disciplina ${nome} adicionada com sucesso`);
    setNome('');
    setCodigo('');
    setProfessorId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookPlus className="h-5 w-5" />
            Adicionar Disciplina
          </DialogTitle>
          <DialogDescription>
            Crie uma nova disciplina e atribua um professor (opcional)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Disciplina *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Matemática, Física..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo">Código *</Label>
            <Input
              id="codigo"
              type="number"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código único da disciplina"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professor">Professor (Opcional)</Label>
            <Select value={professorId} onValueChange={setProfessorId}>
              <SelectTrigger id="professor">
                <SelectValue placeholder="Selecione um professor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem professor</SelectItem>
                {professores.map(professor => (
                  <SelectItem key={professor.ID} value={professor.ID.toString()}>
                    {professor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Adicionar Disciplina
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
