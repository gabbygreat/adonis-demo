import got from 'got'

const _bibleBaseUrl = 'https://api.scripture.api.bible'

export default class BibleService {
  async getBibleList(): Promise<any> {
    const response = await got(`${_bibleBaseUrl}/v1/bibles/de4e12af7f28f599-02/books`, {
      headers: {
        'api-key': 'c19dae521125fa8abd588b6f3b6716c1',
      },
    }).json()
    return response
  }

  async getBibleBookList(bookId: string): Promise<any> {
    const response = await got(
      `${_bibleBaseUrl}/v1/bibles/de4e12af7f28f599-02/books/${bookId}/chapters`,
      {
        headers: {
          'api-key': 'c19dae521125fa8abd588b6f3b6716c1',
        },
      }
    ).json()
    return response
  }

  async getBibleChapter(chapterId: string): Promise<any> {
    const response = await got(
      `${_bibleBaseUrl}/v1/bibles/de4e12af7f28f599-02/chapters/${chapterId}`,
      {
        searchParams: {
          'content-type': 'text',
        },
        headers: {
          'api-key': 'c19dae521125fa8abd588b6f3b6716c1',
        },
      }
    ).json()
    return response
  }
}
