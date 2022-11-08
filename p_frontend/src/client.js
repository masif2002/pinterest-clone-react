import  sanityClient  from '@sanity/client';
import  imageUrlBuilder  from '@sanity/image-url';

export const client = sanityClient({
    projectId: 'YOUR_SANITY_PROJECT_ID',
    dataset: 'production',
    apiVersion: '2022-11-03',
    useCdn: true,
    token: 'YOUR_SANITY_CLIENT_API_TOKEN'
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source) 