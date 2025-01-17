// ... rest of the file remains the same ...

export async function markArticlesSelected(
  selectedArticles: Article[], 
  styles: StyleStrength[], 
  generateImage: boolean = false,
  platform?: string,
  customContent?: string
): Promise<void> {
  try {
    if (selectedArticles.length > 0) {
      const articlesByCategory = selectedArticles.reduce((acc, article) => {
        if (!acc[article.category]) {
          acc[article.category] = [];
        }
        acc[article.category].push(article);
        return acc;
      }, {} as Record<Category, Article[]>);

      await Promise.all(
        Object.entries(articlesByCategory).map(async ([category, articles]) => {
          const tableId = AIRTABLE_CONFIG.tables[category as Category];
          await airtableClient.patch(`/${AIRTABLE_CONFIG.baseId}/${tableId}`, {
            records: articles.map(article => ({
              id: article.recordId,
              fields: {
                [AIRTABLE_CONFIG.fields.status]: AIRTABLE_CONFIG.status.selected
              }
            }))
          });
        })
      );
    }

    const webhookData = {
      selectedArticles: selectedArticles.map(article => ({
        id: article.id,
        category: article.category,
        title: article.title,
        content: article.content,
        url: article.url,
        subcategory1: article.subcategory1,
        subcategory2: article.subcategory2,
        subcategory3: article.subcategory3,
        score: article.score
      })),
      styles: formatStylesString(styles),
      generateImage,
      platform,
      customContent,
      timestamp: new Date().toISOString()
    };

    const response = await axios.post(AIRTABLE_CONFIG.webhookUrl, webhookData);
    
    if (response.status !== 200) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Post generation failed:', message);
    throw new Error(`Failed to generate post: ${message}`);
  }
}