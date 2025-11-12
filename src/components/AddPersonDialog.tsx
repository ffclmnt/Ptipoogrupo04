import { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { Aluno, Professor, ValidationError } from '../types';
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
import { UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { 
  validateCPF, 
  validateEmail, 
  validatePhone, 
  validateCEP,
  formatCPF,
  formatPhone,
  formatCEP,
  generateMatricula,
  generateNumeroInstitucional
} from '../utils/validation';
import { Alert, AlertDescription } from './ui/alert';

interface AddPersonDialogProps {
  type: 'aluno' | 'professor';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPersonDialog({ type, open, onOpenChange }: AddPersonDialogProps) {
  const { adicionarAluno, adicionarProfessor, alunos, professores, verificarCPFDuplicado } = useSchool();
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: '',
    departamento: '',
    titulacao: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];
    const highlighted: string[] = [];

    // Validate required fields
    if (!formData.nome.trim()) {
      newErrors.push({ field: 'nome', message: "O campo 'Nome Completo' é obrigatório" });
      highlighted.push('nome');
    }

    if (!formData.cpf.trim()) {
      newErrors.push({ field: 'cpf', message: "O campo 'CPF' é obrigatório" });
      highlighted.push('cpf');
    } else if (!validateCPF(formData.cpf)) {
      newErrors.push({ field: 'cpf', message: "Formato de CPF inválido" });
      highlighted.push('cpf');
    } else if (verificarCPFDuplicado(formData.cpf)) {
      newErrors.push({ field: 'cpf', message: "CPF já cadastrado no sistema" });
      highlighted.push('cpf');
    }

    if (!formData.dataNascimento) {
      newErrors.push({ field: 'dataNascimento', message: "O campo 'Data de Nascimento' é obrigatório" });
      highlighted.push('dataNascimento');
    }

    if (!formData.telefone.trim()) {
      newErrors.push({ field: 'telefone', message: "O campo 'Telefone' é obrigatório" });
      highlighted.push('telefone');
    } else if (!validatePhone(formData.telefone)) {
      newErrors.push({ field: 'telefone', message: "Formato de telefone inválido" });
      highlighted.push('telefone');
    }

    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: "O campo 'E-mail' é obrigatório" });
      highlighted.push('email');
    } else if (!validateEmail(formData.email)) {
      newErrors.push({ field: 'email', message: "Formato de e-mail inválido" });
      highlighted.push('email');
    }

    // Validate address fields (optional but if filled, must be complete)
    if (formData.cep && !validateCEP(formData.cep)) {
      newErrors.push({ field: 'cep', message: "Formato de CEP inválido" });
      highlighted.push('cep');
    }

    // Professor-specific validation
    if (type === 'professor') {
      if (!formData.departamento.trim()) {
        newErrors.push({ field: 'departamento', message: "O campo 'Departamento' é obrigatório" });
        highlighted.push('departamento');
      }
      if (!formData.titulacao) {
        newErrors.push({ field: 'titulacao', message: "O campo 'Titulação' é obrigatório" });
        highlighted.push('titulacao');
      }
    }

    setErrors(newErrors);
    setHighlightedFields(highlighted);
    return newErrors.length === 0;
  };

  const calculateAge = (birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    const newId = type === 'aluno' 
      ? Math.max(...alunos.map(a => a.ID), 0) + 1
      : Math.max(...professores.map(p => p.ID), 0) + 1;

    const pessoa = {
      ID: newId,
      nome: formData.nome,
      cpf: formatCPF(formData.cpf),
      dataNascimento: formData.dataNascimento,
      idade: calculateAge(formData.dataNascimento),
      telefone: formatPhone(formData.telefone),
      email: formData.email,
      endereco: {
        rua: formData.rua || '',
        numero: formData.numero || '',
        cidade: formData.cidade || '',
        estado: formData.estado || '',
        cep: formData.cep ? formatCEP(formData.cep) : '',
      },
    };

    if (type === 'aluno') {
      const numeroMatricula = generateMatricula();
      const newAluno: Aluno = {
        ...pessoa,
        disciplinas: [],
        notas: {},
        numeroMatricula,
      };
      adicionarAluno(newAluno);
      toast.success(`Aluno(a) cadastrado(a) com sucesso! Matrícula: ${numeroMatricula}`);
    } else {
      const numeroInstitucional = generateNumeroInstitucional();
      const newProfessor: Professor = {
        ...pessoa,
        disciplinas: [],
        numeroInstitucional,
        departamento: formData.departamento,
        titulacao: formData.titulacao,
      };
      adicionarProfessor(newProfessor);
      toast.success(`Professor(a) cadastrado(a) com sucesso! Número Institucional: ${numeroInstitucional}`);
    }

    // Reset form
    setFormData({
      nome: '',
      cpf: '',
      dataNascimento: '',
      telefone: '',
      email: '',
      rua: '',
      numero: '',
      cidade: '',
      estado: '',
      cep: '',
      departamento: '',
      titulacao: '',
    });
    setErrors([]);
    setHighlightedFields([]);
    onOpenChange(false);
  };

  const isFieldHighlighted = (field: string) => highlightedFields.includes(field);
  const getFieldError = (field: string) => errors.find(e => e.field === field)?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[900px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Cadastrar {type === 'aluno' ? 'Aluno' : 'Professor'}
          </DialogTitle>
          <DialogDescription>
            Preencha todos os campos obrigatórios marcados com *
          </DialogDescription>
        </DialogHeader>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p>Foram encontrados erros no formulário:</p>
              <ul className="list-disc list-inside mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mt-4">
          <div className="border-b pb-4">
            <h4 className="mb-3">Dados Pessoais</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                  className={isFieldHighlighted('nome') ? 'border-red-500' : ''}
                />
                {getFieldError('nome') && (
                  <p className="text-sm text-red-500">{getFieldError('nome')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className={isFieldHighlighted('cpf') ? 'border-red-500' : ''}
                />
                {getFieldError('cpf') && (
                  <p className="text-sm text-red-500">{getFieldError('cpf')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  className={isFieldHighlighted('dataNascimento') ? 'border-red-500' : ''}
                />
                {getFieldError('dataNascimento') && (
                  <p className="text-sm text-red-500">{getFieldError('dataNascimento')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className={isFieldHighlighted('telefone') ? 'border-red-500' : ''}
                />
                {getFieldError('telefone') && (
                  <p className="text-sm text-red-500">{getFieldError('telefone')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  className={isFieldHighlighted('email') ? 'border-red-500' : ''}
                />
                {getFieldError('email') && (
                  <p className="text-sm text-red-500">{getFieldError('email')}</p>
                )}
              </div>
            </div>
          </div>

          {type === 'professor' && (
            <div className="border-b pb-4">
              <h4 className="mb-3">Dados Funcionais</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    placeholder="Ex: Ciências Exatas"
                    className={isFieldHighlighted('departamento') ? 'border-red-500' : ''}
                  />
                  {getFieldError('departamento') && (
                    <p className="text-sm text-red-500">{getFieldError('departamento')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titulacao">Titulação *</Label>
                  <Select 
                    value={formData.titulacao} 
                    onValueChange={(value) => setFormData({ ...formData, titulacao: value })}
                  >
                    <SelectTrigger 
                      id="titulacao"
                      className={isFieldHighlighted('titulacao') ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Selecione a titulação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Graduação">Graduação</SelectItem>
                      <SelectItem value="Especialização">Especialização</SelectItem>
                      <SelectItem value="Mestrado">Mestrado</SelectItem>
                      <SelectItem value="Doutorado">Doutorado</SelectItem>
                      <SelectItem value="Pós-Doutorado">Pós-Doutorado</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError('titulacao') && (
                    <p className="text-sm text-red-500">{getFieldError('titulacao')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-b pb-4">
            <h4 className="mb-3">Endereço</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={formData.rua}
                  onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                  placeholder="Nome da rua"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="Número"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  placeholder="00000-000"
                  className={isFieldHighlighted('cep') ? 'border-red-500' : ''}
                />
                {getFieldError('cep') && (
                  <p className="text-sm text-red-500">{getFieldError('cep')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="Cidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Salvar
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Sair
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}