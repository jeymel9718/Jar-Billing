import { ItemProps, Invoice } from "./types";

export function formatCurrency(
  value: string | number,
  locale: string = "es-CR",
  currency: string = "CRC"
): string {
  // Convert the string to a number
  let numberValue: number;
  if (typeof value === "string") {
    numberValue = parseFloat(value);
  } else {
    numberValue = value;
  }

  // Check if the conversion was successful
  if (isNaN(numberValue)) {
    return "";
  }

  // Create a NumberFormat object with the specified locale and currency
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });

  // Format the number as a currency string
  return formatter.format(numberValue);
}

export function validateEmail(email: string): boolean {
  if (email === "") return true;
  // Regular expression to validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const getPercentageMount = (subTotal: string, discount: string) => {
  return formatCurrency(parseFloat(subTotal) * (parseFloat(discount) / 100));
};

export function generateHtml(price: Invoice, priceItems: ItemProps[]): string {
  const itemsHtml = priceItems
    .map(
      (item) => `
    <tr class="item">
      <td>${item.description}</td>
      <td>${formatCurrency(item.price)}</td>
    </tr>
  `
    )
    .join("");

  const htmlContent = `
  <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Factura</title>

		<style>
			.invoice-box {
				height: 100%;
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: rgb(173, 244, 161);
				border-bottom: 1px solid rgb(0, 34, 2);
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}

			/** RTL **/
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}

			.thank-you {
				font-size: 18px;
				color: rgb(43, 107, 40);
				margin-top: 20px;
				text-align: center;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
									<img
										src="https://firebasestorage.googleapis.com/v0/b/northen-aef64.appspot.com/o/jar.jpeg?alt=media&token=4c3eeb8c-b1d9-4c62-a66c-3a6d87247a60"
										style="width: 100%; max-width: 150px"
									/>
								</td>

								<td>
									Factura #: ${price.orderId}<br />
									Fecha: ${price.date}
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="2">
						<table>
							<tr>
								<td>
									Jar-Diseño L&M<br />
									Convertimos su hogar en un Oasis<br />
									86718603
								</td>

								<td>
									${price.name}.<br />
									${price.number}<br />
									${price.email}
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="heading">
					<td>Descripción</td>

					<td>Precio</td>
				</tr>
        ${itemsHtml}
				<tr class="item last">
					<td>Descuento</td>

					<td>${price.discountType === "amount" ? formatCurrency(price.discount) : getPercentageMount(price.subTotal, price.discount)}</td>
				</tr>

				<tr class="total">
					<td></td>

					<td>Total: ${formatCurrency(price.total)}</td>
				</tr>
			</table>
			<div class="thank-you">
				<p>¡Gracias por su confianza y preferencia!</p>
			</div>
		</div>
	</body>
</html>
  `;

  return htmlContent;
}
