import { entities } from "../../entities/useCases/index";
import { SendData } from "../repositories/SendData";

interface OrderPortalSendProps {
  codigo: number;
  descricao: string;
  sequencia: string;
  tamanho: string;
  quantidade: string;
  ativo: "N" | "S";
}

export class OrderImportPortal {
  constructor(private sendData: SendData) {}

  async execute() {
    try {
      const orders = await entities.order.getAll({
        fields: {
          code: true,
          customer: {
            code: true,
            name: true,
          },
          carrier: {
            code: true,
          },
          invoiceAmount: true,
          positionOrder: true,
          entryDate: true,
          deliveryDate: true,
          icmsStValue: true,

          items: {
            product: {
              code: true,
            },

            positionItem: true,
            quantity: true,
            grossAmount: true,
            price: true,
          },
        },
        extraFields: {
          agent: true,
          salesman: true,
          representative: true,
        },
        // search: 'lastChangeDate IN ( "19/09/2022")',
        search: "code IN (1182511)",
      });

      console.log(orders);

      // const ordersNormalized: any[] = [];
      // await this.sendData.post("/order/import", ordersNormalized);
    } catch (error) {
      console.log(error);
    }
  }
}
