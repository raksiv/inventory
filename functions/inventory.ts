import { inventoryApi, products, imageBucket, inventoryPub, recognize } from "../common/resources";
import { uuid } from "uuidv4";

// Define our profile contents
interface Product {
  name: string;
  description: string;
  url: string; 
  labels: string;
}

// Create product with post method
inventoryApi.post("/products", async (ctx) => {
  let id = uuid();
  const product: Product = {
    name: ctx.req.json().name,
    description: ctx.req.json().description,
    url: "",
    labels: ""
  };

  // Create the new product
  await products.doc(id).set(product);

  // Notify 
  const subject = `New product in inventory`;
  const template = `<!DOCTYPE html PUBLIC>
  <html lang="en">
      <title>Product added to inventory</title>
      </head>
      <body>
          {{ name }}<br>
          {{ description }}<br>
          {{ url }}
      </body>
  </html>`;

  await inventoryPub.publish({
      payload: {
          recipient: process.env.SYS_ADMIN_EMAIL,
          subject: subject,
          template: template,
          data: product
      },
    });

  // Return the id
  ctx.res.json({
    msg: `Product with id ${id} created.`,
  });
});

// Retrieve profile with get method
inventoryApi.get("/products/:id", async (ctx) => {
  const { id } = ctx.req.params

  try {
    const image = imageBucket.file(`images/${id}/photo.png`);
    const product = await products.doc(id).get()
    product.url = await image.getDownloadUrl()

    if (product.url) { 
      const labels = await recognize(image.name, process.env.BUCKETNAME)
      console.log(labels)
      product.labels = labels
    }
    return ctx.res.json(product);
  } catch (error) {
    ctx.res.status = 404;
    ctx.res.json({
      msg: `Product with id ${id} not found. ${error}`,
    });
  }
});

// Retrieve all products with get method
inventoryApi.get("/products", async (ctx) => {
  return ctx.res.json({
    output: await products.query().fetch(),
  });
});

inventoryApi.get('/products/:id/image/upload', async (ctx) => {
  const id = ctx.req.params['id'];

  // Return a signed url reference for upload
  const image = imageBucket.file(`images/${id}/photo.png`);
  const photoUrl = await image.getUploadUrl()

  ctx.res.json({
    url: photoUrl,
  });
});



