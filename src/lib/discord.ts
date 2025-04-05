import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1357738638678425810/7GKczNhgIsLOuOM4_8EDyb0KJTf6OsqUIlRLMik6Fij9lEe1d9OCgNSHakNftIdaf20N';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

interface PresentationData {
  id?: string;
  city: string;
  email: string;
  date: Date;
  time: string;
  discordId: string;
  description: string;
  status: string;
  createdAt: Date;
  title?: string;
}

/**
 * Envia uma notificação para o webhook do Discord usando um proxy CORS
 */
export async function sendDiscordNotification(data: PresentationData): Promise<boolean> {
  try {
    const formattedDate = format(data.date, "dd/MM/yyyy", { locale: ptBR });
    
    const embed = {
      title: data.title || "🛩️ Nova Solicitação de Apresentação",
      color: data.status === 'approved' ? 5025616 : // Verde
            data.status === 'rejected' ? 15073536 : // Vermelho
            3447003, // Azul (padrão)
      fields: [
        {
          name: "📍 Cidade",
          value: data.city,
          inline: true
        },
        {
          name: "📅 Data",
          value: formattedDate,
          inline: true
        },
        {
          name: "⏰ Horário",
          value: data.time,
          inline: true
        },
        {
          name: "👤 Discord ID",
          value: data.discordId,
          inline: true
        },
        {
          name: "📧 Email",
          value: data.email,
          inline: true
        },
        {
          name: "📝 Descrição",
          value: data.description
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Esquadrilha da Fumaça - FiveM"
      }
    };

    const payload = {
      embeds: [embed]
    };

    // Método alternativo usando serviço de proxy para contornar CORS
    // ou usando API de backend
    try {
      // Tenta enviar diretamente (pode não funcionar devido ao CORS)
      const directResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (directResponse.ok) {
        console.log('Notificação enviada para o Discord com sucesso (método direto)!');
        return true;
      }
    } catch (directError) {
      console.warn('Erro no método direto, tentando via proxy:', directError);
    }
    
    // Tenta enviar via proxy CORS
    const proxyResponse = await fetch(CORS_PROXY + DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(payload),
    });

    if (!proxyResponse.ok) {
      throw new Error(`Erro ao enviar para o Discord via proxy: ${proxyResponse.statusText}`);
    }
    
    console.log('Notificação enviada para o Discord com sucesso via proxy!');
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação para o Discord:', error);
    
    // Método de fallback - salvar em localStorage para tentativa posterior
    try {
      const pendingNotifications = JSON.parse(localStorage.getItem('pendingDiscordNotifications') || '[]');
      pendingNotifications.push({
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pendingDiscordNotifications', JSON.stringify(pendingNotifications));
      console.log('Notificação salva para tentativa posterior');
    } catch (storageError) {
      console.error('Erro ao salvar notificação para tentativa posterior:', storageError);
    }
    
    return false;
  }
}

/**
 * Tenta reenviar todas as notificações pendentes armazenadas no localStorage
 */
export async function retryPendingNotifications(): Promise<number> {
  try {
    const pendingNotifications = JSON.parse(localStorage.getItem('pendingDiscordNotifications') || '[]');
    if (pendingNotifications.length === 0) {
      return 0;
    }
    
    console.log(`Tentando reenviar ${pendingNotifications.length} notificações pendentes...`);
    
    let successCount = 0;
    const remaining = [];
    
    for (const item of pendingNotifications) {
      try {
        const sent = await sendDiscordNotification(item.data);
        if (sent) {
          successCount++;
        } else {
          remaining.push(item);
        }
      } catch (error) {
        console.error('Erro ao reenviar notificação:', error);
        remaining.push(item);
      }
    }
    
    localStorage.setItem('pendingDiscordNotifications', JSON.stringify(remaining));
    
    console.log(`Reenviadas com sucesso: ${successCount}. Pendentes: ${remaining.length}`);
    return successCount;
  } catch (error) {
    console.error('Erro ao processar notificações pendentes:', error);
    return 0;
  }
} 