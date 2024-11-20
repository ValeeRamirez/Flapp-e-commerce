const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', cartRoutes);

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
});