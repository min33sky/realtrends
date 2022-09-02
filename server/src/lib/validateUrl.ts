import axios from 'axios';
import AppError from './AppError';
import metascraper from 'metascraper';
import logoRule from 'metascraper-logo-favicon';
import publisherRule from 'metascraper-publisher';
import authorRule from 'metascraper-author';
import imageRule from 'metascraper-image';

interface ValidateResult {
  url: string;
  html: string;
}

const scraper = metascraper([
  logoRule(),
  publisherRule(),
  authorRule(),
  imageRule(),
]);

interface ExtractPageInfoResult {
  url: string;
  //? Meta tag에서 추춯할 속성들
  favicon: string | null;
  publisher: string;
  author: string | null;
  thumbnail: string | null;
  domain: string;
}

const client = axios.create({
  timeout: 8000,
});

/**
 * 페이지 정보 추출 (url, author, thumbnail 등)
 * @param url
 */
export async function extractPageInfo(
  url: string,
): Promise<ExtractPageInfoResult> {
  const { html, url: validatedUrl } = await validateUrl(url);
  const data = await scraper({
    url: validatedUrl,
    html,
  });

  console.log('data::::::::: ', data);

  const domain = new URL(validatedUrl).hostname;

  return {
    url: validatedUrl,
    author: data.author,
    favicon: data.logo,
    publisher: data.publisher ?? domain,
    thumbnail: data.image,
    domain,
  };
}
/**
 * URL 유효성 체크
 * @param url
 * @returns
 */
async function validateUrl(url: string): Promise<ValidateResult> {
  //? url이 http or https로 시작하는지 확인
  const hasProtocol = /^https?:\/\//.test(url);

  if (hasProtocol) {
    try {
      const response = await client.get(url);
      return {
        url,
        html: response.data,
      };
    } catch (error) {
      throw new AppError('InvalidURLError');
    }
  }

  //? http와 https를 앞에 붙여서 요청을 보내고 하나라도 성공하면 성공 응답 보내기
  const withHttp = `http://${url}`;
  const withHttps = `https://${url}`;
  const [http, https] = await Promise.allSettled([
    client.get(withHttp),
    client.get(withHttps),
  ]);

  if (https.status === 'fulfilled') {
    return {
      url: withHttps,
      html: https.value.data,
    };
  }

  if (http.status === 'fulfilled') {
    return {
      url: withHttp,
      html: http.value.data,
    };
  }

  throw new AppError('InvalidURLError');
}
