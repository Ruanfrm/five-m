import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, updateDoc, doc, getDoc, deleteDoc, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { format, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { sendDiscordNotification } from '@/lib/discord'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

interface Presentation {
  id: string
  city: string
  email: string
  date: Date
  time: string
  description: string
  discordId: string
  status: 'pending' | 'approved' | 'rejected' | 'rescheduled' | 'canceled'
  createdAt: Date
}

interface Enlistment {
  id: string
  nome: string
  sobrenome: string
  email: string
  discordNick: string
  motivoEntrada: string
  conhecimentoAviao: string
  idade: string
  vooFivem: string
  conheceEsquadrilha: string
  turno: string[]
  userIP: string
  status: 'pending' | 'approved' | 'rejected' | 'in_progress'
  createdAt: Date
}

interface Pilot {
  id: string
  name: string
  position: string
  photoURL: string
  order: number
  createdAt: Date
}

interface CarouselImage {
  id: string
  url: string
  title: string
  description: string
  order: number
  createdAt: Date
}

type DialogMode = 'manage' | 'edit' | 'create';
type EnlistmentDialogMode = 'manage' | 'edit';

export default function Dashboard() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [enlistments, setEnlistments] = useState<Enlistment[]>([])
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null)
  const [selectedEnlistment, setSelectedEnlistment] = useState<Enlistment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEnlistmentDialogOpen, setIsEnlistmentDialogOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isEnlistmentAlertOpen, setIsEnlistmentAlertOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>('manage')
  const [enlistmentDialogMode, setEnlistmentDialogMode] = useState<EnlistmentDialogMode>('manage')
  
  // Estado para o formulário de edição
  const [editCity, setEditCity] = useState('')
  const [editDate, setEditDate] = useState<Date | undefined>(undefined)
  const [editTime, setEditTime] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState<Presentation['status']>('pending')
  const [loading, setLoading] = useState(false)

  // Estado para o formulário de edição de alistamento
  const [editEnlistmentStatus, setEditEnlistmentStatus] = useState<Enlistment['status']>('pending')
  const [enlistmentLoading, setEnlistmentLoading] = useState(false)

  // Estado para a galeria
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [newImageTitle, setNewImageTitle] = useState('')
  const [newImageDescription, setNewImageDescription] = useState('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [newImageOrder, setNewImageOrder] = useState(0)

  // Estado para os pilotos
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [selectedPilots, setSelectedPilots] = useState<string[]>([])
  const [isPilotDialogOpen, setIsPilotDialogOpen] = useState(false)
  const [isPilotDeleteAlertOpen, setIsPilotDeleteAlertOpen] = useState(false)
  const [pilotLoading, setPilotLoading] = useState(false)
  const [newPilotName, setNewPilotName] = useState('')
  const [newPilotPosition, setNewPilotPosition] = useState('')
  const [newPilotFile, setNewPilotFile] = useState<File | null>(null)
  const [newPilotOrder, setNewPilotOrder] = useState(0)

  useEffect(() => {
    // Carregar apresentações
    const q = query(collection(db, 'presentations'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const presentationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Presentation[]
      setPresentations(presentationsData)
    })

    // Carregar alistamentos
    const enlistmentsQuery = query(collection(db, 'alistamentos'), orderBy('createdAt', 'desc'))
    const unsubscribeEnlistments = onSnapshot(enlistmentsQuery, (snapshot) => {
      const enlistmentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Enlistment[]
      setEnlistments(enlistmentsData)
    })

    // Carregar imagens do carrossel
    const carouselQuery = query(collection(db, 'carousel'), orderBy('order', 'asc'))
    const unsubscribeCarousel = onSnapshot(carouselQuery, (snapshot) => {
      const imagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as CarouselImage[]
      setCarouselImages(imagesData)
    })

    // Carregar pilotos
    const pilotsQuery = query(collection(db, 'pilots'), orderBy('order', 'asc'))
    const unsubscribePilots = onSnapshot(pilotsQuery, (snapshot) => {
      const pilotsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Pilot[]
      setPilots(pilotsData)
    })

    return () => {
      unsubscribe()
      unsubscribeEnlistments()
      unsubscribeCarousel()
      unsubscribePilots()
    }
  }, [])

  // Função para preencher o formulário de edição com os dados da apresentação
  const setupEditForm = (presentation: Presentation) => {
    setEditCity(presentation.city)
    setEditDate(presentation.date)
    setEditTime(presentation.time)
    setEditDescription(presentation.description)
    setEditStatus(presentation.status)
  }

  // Função para limpar o formulário
  const resetForm = () => {
    setEditCity('')
    setEditDate(new Date())
    setEditTime('')
    setEditDescription('')
    setEditStatus('pending')
  }

  // Função para abrir o dialog de gerenciamento
  const openManageDialog = (presentation: Presentation) => {
    setSelectedPresentation(presentation)
    setDialogMode('manage')
    setIsDialogOpen(true)
  }

  // Função para abrir o dialog de edição
  const openEditDialog = (presentation: Presentation) => {
    setSelectedPresentation(presentation)
    setupEditForm(presentation)
    setDialogMode('edit')
    setIsDialogOpen(true)
  }

  // Função para abrir o dialog de criação
  const openCreateDialog = () => {
    resetForm()
    setSelectedPresentation(null)
    setDialogMode('create')
    setIsDialogOpen(true)
  }

  // Função para confirmar exclusão
  const confirmDelete = (presentation: Presentation) => {
    setSelectedPresentation(presentation)
    setIsAlertOpen(true)
  }

  // Funções para alistamentos
  const openEnlistmentManageDialog = (enlistment: Enlistment) => {
    setSelectedEnlistment(enlistment)
    setEditEnlistmentStatus(enlistment.status)
    setEnlistmentDialogMode('manage')
    setIsEnlistmentDialogOpen(true)
  }

  const openEnlistmentEditDialog = (enlistment: Enlistment) => {
    setSelectedEnlistment(enlistment)
    setEditEnlistmentStatus(enlistment.status)
    setEnlistmentDialogMode('edit')
    setIsEnlistmentDialogOpen(true)
  }

  const confirmEnlistmentDelete = (enlistment: Enlistment) => {
    setSelectedEnlistment(enlistment)
    setIsEnlistmentAlertOpen(true)
  }

  // Atualiza apenas o status
  const handleStatusUpdate = async (presentationId: string, newStatus: Presentation['status']) => {
    try {
      setLoading(true)
      // Obter os dados completos da apresentação
      const presentationRef = doc(db, 'presentations', presentationId);
      const presentationDoc = await getDoc(presentationRef);
      
      if (!presentationDoc.exists()) {
        throw new Error('Apresentação não encontrada');
      }
      
      const presentationData = {
        ...presentationDoc.data(),
        id: presentationId,
        date: presentationDoc.data().date.toDate(),
        createdAt: presentationDoc.data().createdAt.toDate(),
        status: newStatus
      } as Presentation;
      
      // Atualizar o status no Firestore
      await updateDoc(presentationRef, {
        status: newStatus,
      });
      
      // Enviar notificação para o Discord
      try {
        let title;
        switch(newStatus) {
          case 'approved':
            title = '✅ Apresentação Aprovada';
            break;
          case 'rejected':
            title = '❌ Apresentação Rejeitada';
            break;
          case 'rescheduled':
            title = '🔄 Apresentação Reagendada';
            break;
          case 'canceled':
            title = '🚫 Apresentação Cancelada';
            break;
          default:
            title = '🔔 Status da Apresentação Atualizado';
        }
          
        const notificationSent = await sendDiscordNotification({
          ...presentationData,
          title
        });
        
        if (notificationSent) {
          console.log(`Notificação de ${newStatus} enviada para o Discord com sucesso`);
        } else {
          console.warn(`Falha ao enviar notificação de ${newStatus} para o Discord`);
        }
      } catch (discordError) {
        console.error(`Erro ao enviar notificação de ${newStatus} para o Discord:`, discordError);
      }
      
      toast.success(`Status da apresentação atualizado com sucesso`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error('Erro ao atualizar status. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Atualiza o status do alistamento
  const handleEnlistmentStatusUpdate = async (enlistmentId: string, newStatus: Enlistment['status']) => {
    try {
      setEnlistmentLoading(true)
      const enlistmentRef = doc(db, 'alistamentos', enlistmentId);
      
      // Atualizar o status no Firestore
      await updateDoc(enlistmentRef, {
        status: newStatus,
      });
      
      // Enviar notificação para o Discord
      try {
        let title;
        switch(newStatus) {
          case 'approved':
            title = '✅ Alistamento Aprovado';
            break;
          case 'rejected':
            title = '❌ Alistamento Rejeitado';
            break;
          case 'in_progress':
            title = '🔄 Alistamento Em Análise';
            break;
          default:
            title = '🔔 Status do Alistamento Atualizado';
        }
          
        const enlistment = enlistments.find(e => e.id === enlistmentId);
        if (enlistment) {
          const notificationSent = await sendDiscordNotification({
            city: 'N/A',
            email: enlistment.email,
            date: new Date(),
            time: 'N/A',
            discordId: enlistment.discordNick,
            description: `Nome: ${enlistment.nome} ${enlistment.sobrenome}\nEmail: ${enlistment.email}\nIdade: ${enlistment.idade}\nMotivo: ${enlistment.motivoEntrada}\nConhecimento: ${enlistment.conhecimentoAviao}\nVoo FIVEM: ${enlistment.vooFivem}\nConhece Esquadrilha: ${enlistment.conheceEsquadrilha}\nTurno: ${enlistment.turno.join(', ')}\nStatus: ${getEnlistmentStatusText(newStatus)}`,
            status: newStatus,
            createdAt: new Date(),
            title
          });
          
          if (notificationSent) {
            console.log(`Notificação de ${newStatus} enviada para o Discord com sucesso`);
          } else {
            console.warn(`Falha ao enviar notificação de ${newStatus} para o Discord`);
          }
        }
      } catch (discordError) {
        console.error(`Erro ao enviar notificação de ${newStatus} para o Discord:`, discordError);
      }
      
      toast.success(`Status do alistamento atualizado com sucesso`);
      setIsEnlistmentDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar status do alistamento:", error);
      toast.error('Erro ao atualizar status. Tente novamente.');
    } finally {
      setEnlistmentLoading(false);
    }
  }

  // Função para atualizar todos os dados da apresentação
  const handleUpdatePresentation = async () => {
    if (!selectedPresentation || !editDate) {
      toast.error('Dados incompletos. Verifique todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const presentationRef = doc(db, 'presentations', selectedPresentation.id);
      
      // Verificar se a apresentação existe
      const presentationDoc = await getDoc(presentationRef);
      if (!presentationDoc.exists()) {
        throw new Error('Apresentação não encontrada');
      }
      
      // Atualizar os dados no Firestore
      await updateDoc(presentationRef, {
        city: editCity,
        date: Timestamp.fromDate(editDate),
        time: editTime,
        description: editDescription,
        status: editStatus,
      });

      // Enviar notificação para o Discord
      try {
        await sendDiscordNotification({
          ...selectedPresentation,
          city: editCity,
          date: editDate,
          time: editTime,
          description: editDescription,
          status: editStatus,
          title: '✏️ Apresentação Atualizada'
        });
      } catch (discordError) {
        console.error('Erro ao enviar notificação de atualização:', discordError);
      }
      
      toast.success('Apresentação atualizada com sucesso');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar apresentação:', error);
      toast.error('Erro ao atualizar apresentação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Função para criar uma nova apresentação
  const handleCreatePresentation = async () => {
    if (!editCity || !editDate || !editTime || !editDescription) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      const newPresentation = {
        city: editCity,
        date: Timestamp.fromDate(editDate),
        time: editTime,
        description: editDescription,
        status: editStatus,
        createdAt: Timestamp.fromDate(new Date()),
        email: 'criado-pelo-admin@eda.com', // Email padrão para criações pelo admin
        discordId: 'Admin' // ID do Discord padrão para criações pelo admin
      };
      
      // Adicionar ao Firestore
      const docRef = await addDoc(collection(db, 'presentations'), newPresentation);
      
      // Enviar notificação para o Discord
      try {
        await sendDiscordNotification({
          id: docRef.id,
          ...newPresentation,
          date: editDate,
          createdAt: new Date(),
          title: '➕ Nova Apresentação Criada'
        });
      } catch (discordError) {
        console.error('Erro ao enviar notificação de nova apresentação:', discordError);
      }
      
      toast.success('Nova apresentação criada com sucesso');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar apresentação:', error);
      toast.error('Erro ao criar apresentação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Função para excluir uma apresentação
  const handleDeletePresentation = async () => {
    if (!selectedPresentation) return;
    
    try {
      setLoading(true);
      
      // Excluir do Firestore
      await deleteDoc(doc(db, 'presentations', selectedPresentation.id));
      
      toast.success('Apresentação excluída com sucesso');
      setIsAlertOpen(false);
    } catch (error) {
      console.error('Erro ao excluir apresentação:', error);
      toast.error('Erro ao excluir apresentação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Função para excluir um alistamento
  const handleDeleteEnlistment = async () => {
    if (!selectedEnlistment) return;
    
    try {
      setEnlistmentLoading(true);
      
      // Excluir do Firestore
      await deleteDoc(doc(db, 'alistamentos', selectedEnlistment.id));
      
      toast.success('Alistamento excluído com sucesso');
      setIsEnlistmentAlertOpen(false);
    } catch (error) {
      console.error('Erro ao excluir alistamento:', error);
      toast.error('Erro ao excluir alistamento. Tente novamente.');
    } finally {
      setEnlistmentLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/15 text-green-500">Aprovada</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/15 text-red-500">Rejeitada</Badge>
      case 'rescheduled':
        return <Badge className="bg-blue-500/15 text-blue-500">Reagendada</Badge>
      case 'canceled':
        return <Badge className="bg-gray-500/15 text-gray-500">Cancelada</Badge>
      default:
        return <Badge className="bg-yellow-500/15 text-yellow-500">Pendente</Badge>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      case 'rescheduled':
        return 'Reagendada';
      case 'canceled':
        return 'Cancelada';
      default:
        return 'Pendente';
    }
  }

  const getEnlistmentStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/15 text-green-500">Aprovado</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/15 text-red-500">Rejeitado</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-500/15 text-blue-500">Em Análise</Badge>
      default:
        return <Badge className="bg-yellow-500/15 text-yellow-500">Pendente</Badge>
    }
  }

  const getEnlistmentStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'in_progress':
        return 'Em Análise';
      default:
        return 'Pendente';
    }
  }

  // Funções para a galeria
  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const handleSelectAll = () => {
    setSelectedImages(prev => 
      prev.length === carouselImages.length 
        ? [] 
        : carouselImages.map(img => img.id)
    )
  }

  const handleUploadImage = async () => {
    if (!newImageFile) {
      toast.error('Selecione uma imagem para upload')
      return
    }

    try {
      setUploadLoading(true)
      const storage = getStorage()
      const storageRef = ref(storage, `carousel/${Date.now()}_${newImageFile.name}`)
      
      // Upload do arquivo
      await uploadBytes(storageRef, newImageFile)
      const url = await getDownloadURL(storageRef)
      
      // Salvar no Firestore
      const imageData = {
        url,
        title: newImageTitle,
        description: newImageDescription,
        order: newImageOrder,
        createdAt: new Date()
      }
      
      await addDoc(collection(db, 'carousel'), imageData)
      
      toast.success('Imagem adicionada com sucesso')
      setIsUploadDialogOpen(false)
      resetUploadForm()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload da imagem')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDeleteImages = async () => {
    if (selectedImages.length === 0) {
      toast.error('Selecione imagens para excluir')
      return
    }

    try {
      setUploadLoading(true)
      const storage = getStorage()
      
      // Excluir do Storage e Firestore
      for (const imageId of selectedImages) {
        const image = carouselImages.find(img => img.id === imageId)
        if (image) {
          // Excluir do Storage
          const storageRef = ref(storage, image.url)
          await deleteObject(storageRef)
          
          // Excluir do Firestore
          await deleteDoc(doc(db, 'carousel', imageId))
        }
      }
      
      toast.success('Imagens excluídas com sucesso')
      setSelectedImages([])
      setIsDeleteAlertOpen(false)
    } catch (error) {
      console.error('Erro ao excluir imagens:', error)
      toast.error('Erro ao excluir imagens')
    } finally {
      setUploadLoading(false)
    }
  }

  const resetUploadForm = () => {
    setNewImageTitle('')
    setNewImageDescription('')
    setNewImageFile(null)
    setNewImageOrder(carouselImages.length)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as solicitações de apresentação e alistamento
            </p>
          </div>
        </div>

        <Tabs defaultValue="presentations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="presentations">Apresentações</TabsTrigger>
            <TabsTrigger value="enlistments">Alistamentos</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="pilots">Pilotos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presentations">
            <div className="flex justify-end mb-4">
              <Button onClick={openCreateDialog}>Nova Apresentação</Button>
            </div>
            
            <div className="grid gap-6">
              {presentations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma solicitação de apresentação encontrada.
                  </CardContent>
                </Card>
              ) : (
                presentations.map((presentation) => (
                  <Card key={presentation.id} className="bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle>{presentation.city}</CardTitle>
                        <CardDescription>
                          Solicitado em {format(presentation.createdAt, "dd 'de' MMMM", { locale: ptBR })}
                        </CardDescription>
                      </div>
                      {getStatusBadge(presentation.status)}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Data</p>
                            <p>{format(presentation.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Horário</p>
                            <p>{presentation.time}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Discord ID</p>
                            <p>{presentation.discordId}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p>{presentation.email}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                          <p className="text-sm">{presentation.description}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(presentation)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openManageDialog(presentation)}
                      >
                        Gerenciar Status
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(presentation)}
                      >
                        Excluir
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="enlistments">
            <div className="grid gap-6">
              {enlistments.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma solicitação de alistamento encontrada.
                  </CardContent>
                </Card>
              ) : (
                enlistments.map((enlistment) => (
                  <Card key={enlistment.id} className="bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle>{enlistment.nome} {enlistment.sobrenome}</CardTitle>
                        <CardDescription>
                          Solicitado em {format(enlistment.createdAt, "dd 'de' MMMM", { locale: ptBR })}
                        </CardDescription>
                      </div>
                      {getEnlistmentStatusBadge(enlistment.status)}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p>{enlistment.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Discord</p>
                            <p>{enlistment.discordNick}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Idade</p>
                            <p>{enlistment.idade}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">IP</p>
                            <p className="font-mono text-xs">{enlistment.userIP}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Motivo de Entrada</p>
                          <p className="text-sm">{enlistment.motivoEntrada}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Conhecento em Aviação</p>
                            <p className="text-sm">{enlistment.conhecimentoAviao === 'com_conhecimento' ? 'Sim, tenho conhecimento' : 'Não tenho conhecimento, mas estou disposto a aprender'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Voo FIVEM</p>
                            <p className="text-sm">{enlistment.vooFivem === 'sim' ? 'Sim' : 'Não'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Conhece Esquadrilha</p>
                            <p className="text-sm">{enlistment.conheceEsquadrilha === 'sim' ? 'Sim' : 'Não'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Turno</p>
                            <p className="text-sm">{enlistment.turno.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEnlistmentEditDialog(enlistment)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEnlistmentManageDialog(enlistment)}
                      >
                        Gerenciar Status
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmEnlistmentDelete(enlistment)}
                      >
                        Excluir
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all" 
                  checked={selectedImages.length === carouselImages.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">Selecionar todas</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  Adicionar Imagem
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteAlertOpen(true)}
                  disabled={selectedImages.length === 0}
                >
                  Excluir Selecionadas
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {carouselImages.map((image) => (
                <Card key={image.id} className="relative">
                  <div className="absolute top-2 left-2">
                    <Checkbox 
                      checked={selectedImages.includes(image.id)}
                      onCheckedChange={() => handleImageSelect(image.id)}
                    />
                  </div>
                  <CardContent className="p-4">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-2">
                      <h3 className="font-semibold">{image.title}</h3>
                      <p className="text-sm text-muted-foreground">{image.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ordem: {image.order}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pilots">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all-pilots" 
                  checked={selectedPilots.length === pilots.length}
                  onCheckedChange={() => {
                    setSelectedPilots(prev => 
                      prev.length === pilots.length 
                        ? [] 
                        : pilots.map(pilot => pilot.id)
                    )
                  }}
                />
                <Label htmlFor="select-all-pilots">Selecionar todos</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => {
                  setNewPilotName('')
                  setNewPilotPosition('')
                  setNewPilotFile(null)
                  setNewPilotOrder(pilots.length)
                  setIsPilotDialogOpen(true)
                }}>
                  Adicionar Piloto
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsPilotDeleteAlertOpen(true)}
                  disabled={selectedPilots.length === 0}
                >
                  Excluir Selecionados
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pilots.map((pilot) => (
                <Card key={pilot.id} className="relative">
                  <div className="absolute top-2 left-2">
                    <Checkbox 
                      checked={selectedPilots.includes(pilot.id)}
                      onCheckedChange={() => {
                        setSelectedPilots(prev => 
                          prev.includes(pilot.id) 
                            ? prev.filter(id => id !== pilot.id)
                            : [...prev, pilot.id]
                        )
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full overflow-hidden">
                      <img 
                        src={pilot.photoURL} 
                        alt={pilot.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{pilot.name}</h3>
                      <p className="text-sm text-muted-foreground">{pilot.position}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ordem: {pilot.order}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para gerenciar status */}
        <Dialog open={isDialogOpen && dialogMode === 'manage'} onOpenChange={(open) => {
          if (!open) setIsDialogOpen(false);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerenciar Status da Apresentação</DialogTitle>
              <DialogDescription>
                Escolha uma nova situação para a apresentação em {selectedPresentation?.city}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Status Atual: {selectedPresentation && getStatusText(selectedPresentation.status)}</p>
              </div>
            </div>
            <DialogFooter className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate(selectedPresentation!.id, 'pending')}
                disabled={loading || selectedPresentation?.status === 'pending'}
              >
                Pendente
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate(selectedPresentation!.id, 'approved')}
                disabled={loading || selectedPresentation?.status === 'approved'}
              >
                Aprovar
              </Button>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleStatusUpdate(selectedPresentation!.id, 'rejected')}
                disabled={loading || selectedPresentation?.status === 'rejected'}
              >
                Rejeitar
              </Button>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleStatusUpdate(selectedPresentation!.id, 'rescheduled')}
                disabled={loading || selectedPresentation?.status === 'rescheduled'}
              >
                Reagendar
              </Button>
              <Button
                variant="default"
                className="bg-gray-600 hover:bg-gray-700"
                onClick={() => handleStatusUpdate(selectedPresentation!.id, 'canceled')}
                disabled={loading || selectedPresentation?.status === 'canceled'}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para edição */}
        <Dialog open={isDialogOpen && dialogMode === 'edit'} onOpenChange={(open) => {
          if (!open) setIsDialogOpen(false);
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Apresentação</DialogTitle>
              <DialogDescription>
                Modifique os dados da apresentação
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">Cidade</label>
                <Input
                  id="city"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <Calendar
                  mode="single"
                  selected={editDate}
                  onSelect={setEditDate}
                  disabled={(date) => date < new Date() && !isToday(date)}
                  className="border rounded-md p-3"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">Horário</label>
                <Input
                  id="time"
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                <Textarea
                  id="description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select
                  value={editStatus}
                  onValueChange={(value: string) => setEditStatus(value as Presentation['status'])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovada</SelectItem>
                    <SelectItem value="rejected">Rejeitada</SelectItem>
                    <SelectItem value="rescheduled">Reagendada</SelectItem>
                    <SelectItem value="canceled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdatePresentation}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para criar */}
        <Dialog open={isDialogOpen && dialogMode === 'create'} onOpenChange={(open) => {
          if (!open) setIsDialogOpen(false);
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Apresentação</DialogTitle>
              <DialogDescription>
                Adicione uma nova apresentação ao calendário
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">Cidade*</label>
                <Input
                  id="city"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data*</label>
                <Calendar
                  mode="single"
                  selected={editDate}
                  onSelect={setEditDate}
                  className="border rounded-md p-3"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">Horário*</label>
                <Input
                  id="time"
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Descrição*</label>
                <Textarea
                  id="description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status*</label>
                <Select
                  value={editStatus}
                  onValueChange={(value: string) => setEditStatus(value as Presentation['status'])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovada</SelectItem>
                    <SelectItem value="rejected">Rejeitada</SelectItem>
                    <SelectItem value="rescheduled">Reagendada</SelectItem>
                    <SelectItem value="canceled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreatePresentation}
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Apresentação'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para gerenciar status de alistamento */}
        <Dialog open={isEnlistmentDialogOpen && enlistmentDialogMode === 'manage'} onOpenChange={(open) => {
          if (!open) setIsEnlistmentDialogOpen(false);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerenciar Status do Alistamento</DialogTitle>
              <DialogDescription>
                Escolha uma nova situação para o alistamento de {selectedEnlistment?.nome} {selectedEnlistment?.sobrenome}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Status Atual: {selectedEnlistment && getEnlistmentStatusText(selectedEnlistment.status)}</p>
              </div>
            </div>
            <DialogFooter className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleEnlistmentStatusUpdate(selectedEnlistment!.id, 'pending')}
                disabled={enlistmentLoading || selectedEnlistment?.status === 'pending'}
              >
                Pendente
              </Button>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleEnlistmentStatusUpdate(selectedEnlistment!.id, 'in_progress')}
                disabled={enlistmentLoading || selectedEnlistment?.status === 'in_progress'}
              >
                Em Análise
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleEnlistmentStatusUpdate(selectedEnlistment!.id, 'approved')}
                disabled={enlistmentLoading || selectedEnlistment?.status === 'approved'}
              >
                Aprovar
              </Button>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleEnlistmentStatusUpdate(selectedEnlistment!.id, 'rejected')}
                disabled={enlistmentLoading || selectedEnlistment?.status === 'rejected'}
              >
                Rejeitar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para edição de alistamento */}
        <Dialog open={isEnlistmentDialogOpen && enlistmentDialogMode === 'edit'} onOpenChange={(open) => {
          if (!open) setIsEnlistmentDialogOpen(false);
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Alistamento</DialogTitle>
              <DialogDescription>
                Modifique o status do alistamento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="enlistment-status" className="text-sm font-medium">Status</label>
                <Select
                  value={editEnlistmentStatus}
                  onValueChange={(value: string) => setEditEnlistmentStatus(value as Enlistment['status'])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Análise</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEnlistmentDialogOpen(false)}
                disabled={enlistmentLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleEnlistmentStatusUpdate(selectedEnlistment!.id, editEnlistmentStatus)}
                disabled={enlistmentLoading}
              >
                {enlistmentLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog para confirmar exclusão */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Esta apresentação será permanentemente removida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePresentation}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Alert Dialog para confirmar exclusão de alistamento */}
        <AlertDialog open={isEnlistmentAlertOpen} onOpenChange={setIsEnlistmentAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Este alistamento será permanentemente removido.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={enlistmentLoading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteEnlistment}
                disabled={enlistmentLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {enlistmentLoading ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de Upload */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Imagem ao Carrossel</DialogTitle>
              <DialogDescription>
                Faça upload de uma nova imagem para o carrossel da página inicial
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  placeholder="Digite o título da imagem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newImageDescription}
                  onChange={(e) => setNewImageDescription(e.target.value)}
                  placeholder="Digite a descrição da imagem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Ordem</Label>
                <Input
                  id="order"
                  type="number"
                  value={newImageOrder}
                  onChange={(e) => setNewImageOrder(Number(e.target.value))}
                  placeholder="Digite a ordem da imagem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Imagem</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
                disabled={uploadLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUploadImage}
                disabled={uploadLoading}
              >
                {uploadLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog de Exclusão */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. As imagens selecionadas serão permanentemente removidas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={uploadLoading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteImages}
                disabled={uploadLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {uploadLoading ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog para adicionar piloto */}
        <Dialog open={isPilotDialogOpen} onOpenChange={setIsPilotDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Piloto</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo piloto
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pilot-name">Nome</Label>
                <Input
                  id="pilot-name"
                  value={newPilotName}
                  onChange={(e) => setNewPilotName(e.target.value)}
                  placeholder="Digite o nome do piloto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pilot-position">Posição</Label>
                <Select
                  value={newPilotPosition}
                  onValueChange={setNewPilotPosition}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Líder</SelectItem>
                    <SelectItem value="2">2 - Ala Direito</SelectItem>
                    <SelectItem value="3">3 - Ala Esquerdo</SelectItem>
                    <SelectItem value="4">4 - Ferrolho</SelectItem>
                    <SelectItem value="5">5 - Ala Esquerdo Externo</SelectItem>
                    <SelectItem value="6">6 - Ala Direito Externo</SelectItem>
                    <SelectItem value="7">7 - Isolado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pilot-order">Ordem</Label>
                <Input
                  id="pilot-order"
                  type="number"
                  value={newPilotOrder}
                  onChange={(e) => setNewPilotOrder(Number(e.target.value))}
                  placeholder="Digite a ordem do piloto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pilot-photo">Foto</Label>
                <Input
                  id="pilot-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPilotFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPilotDialogOpen(false)}
                disabled={pilotLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (!newPilotFile) {
                    toast.error('Selecione uma foto para o piloto')
                    return
                  }

                  try {
                    setPilotLoading(true)
                    const storage = getStorage()
                    const storageRef = ref(storage, `pilots/${Date.now()}_${newPilotFile.name}`)
                    
                    // Upload da foto
                    await uploadBytes(storageRef, newPilotFile)
                    const photoURL = await getDownloadURL(storageRef)
                    
                    // Salvar no Firestore
                    const pilotData = {
                      name: newPilotName,
                      position: newPilotPosition,
                      photoURL,
                      order: newPilotOrder,
                      createdAt: new Date()
                    }
                    
                    await addDoc(collection(db, 'pilots'), pilotData)
                    
                    toast.success('Piloto adicionado com sucesso')
                    setIsPilotDialogOpen(false)
                    setNewPilotName('')
                    setNewPilotPosition('')
                    setNewPilotFile(null)
                    setNewPilotOrder(pilots.length)
                  } catch (error) {
                    console.error('Erro ao adicionar piloto:', error)
                    toast.error('Erro ao adicionar piloto')
                  } finally {
                    setPilotLoading(false)
                  }
                }}
                disabled={pilotLoading}
              >
                {pilotLoading ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog para confirmar exclusão de pilotos */}
        <AlertDialog open={isPilotDeleteAlertOpen} onOpenChange={setIsPilotDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Os pilotos selecionados serão permanentemente removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pilotLoading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    setPilotLoading(true)
                    const storage = getStorage()
                    
                    // Excluir do Storage e Firestore
                    for (const pilotId of selectedPilots) {
                      const pilot = pilots.find(p => p.id === pilotId)
                      if (pilot) {
                        // Excluir foto do Storage
                        const storageRef = ref(storage, pilot.photoURL)
                        await deleteObject(storageRef)
                        
                        // Excluir do Firestore
                        await deleteDoc(doc(db, 'pilots', pilotId))
                      }
                    }
                    
                    toast.success('Pilotos excluídos com sucesso')
                    setSelectedPilots([])
                    setIsPilotDeleteAlertOpen(false)
                  } catch (error) {
                    console.error('Erro ao excluir pilotos:', error)
                    toast.error('Erro ao excluir pilotos')
                  } finally {
                    setPilotLoading(false)
                  }
                }}
                disabled={pilotLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {pilotLoading ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 