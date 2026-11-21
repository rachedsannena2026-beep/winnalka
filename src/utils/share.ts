import { ServiceItem } from '../types/service';

function getSharePageUrl(): string {
  if (typeof window !== 'undefined' && window.location?.href) {
    return window.location.href;
  }
  return 'https://winnal9a.tn';
}

export function buildDarijaShareText(service: ServiceItem): string {
  return [
    `لقيتلك خدمة طيارة على منصة winnal9a في صفاقس!`,
    `«${service.title}» عند ${service.providerName} (${service.city})`,
    `السوم يبدأ من ${service.priceFrom} ${service.priceUnit} · التقييم ${service.rating.toFixed(1)}/5 (${service.reviewCount} تقييم)`,
    `شوف التفاصيل واحجز ديركت:`,
  ].join('\n');
}

export function buildWhatsAppShareUrl(service: ServiceItem): string {
  const pageUrl = getSharePageUrl();
  const fullText = `${buildDarijaShareText(service)}\n${pageUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(fullText)}`;
}

export function buildFacebookShareUrl(service: ServiceItem): string {
  const pageUrl = getSharePageUrl();
  const quoteText = `كان تلوج على خدمة ثقة في صفاقس، شوف «${service.title}» عند ${service.providerName} (${service.city}) على winnal9a — السوم يبدأ من ${service.priceFrom} ${service.priceUnit} وتقييم الحرفاء ${service.rating.toFixed(1)}/5!`;
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(quoteText)}`;
}

export function buildTwitterShareUrl(service: ServiceItem): string {
  const pageUrl = getSharePageUrl();
  const tweetText = `تلوج على خدمة باهية في صفاقس؟ جرّب «${service.title}» عند ${service.providerName} على winnal9a — السوم يبدأ من ${service.priceFrom} ${service.priceUnit} (${service.rating.toFixed(1)}/5 نجوم)`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(pageUrl)}&hashtags=${encodeURIComponent('winnal9a,صفاقس,تونس')}`;
}
