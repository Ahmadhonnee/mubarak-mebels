import { StyledInvoice } from "./invoice.styled";

export const Invoice = ({ invoice, ...props }) => {
  if (!invoice) {
    return null;
  }
  const {
    img: invoiceImg,
    title: invoiceTitle,
    date: invoiceDate,
    status: invoiceStatus,
    percent: invoicePercent,
  } = invoice;

  return (
    <tr {...props}>
      <td>
        <img
          alt="..."
          src={invoiceImg}
          class="avatar avatar-sm rounded-circle me-2"
        />
        <a class="text-heading font-semibold" href="#">
          {invoiceTitle}
        </a>
      </td>
      <td>{invoiceDate}</td>
      <td>
        <span class="badge badge-lg badge-dot">
          <i
            class={
              invoiceStatus === "In progress" ? "bg-warning" : "bg-success"
            }
          ></i>
          {invoiceStatus}
        </span>
      </td>

      <td>
        <div class="d-flex align-items-center">
          <span class="me-2">{invoicePercent}</span>
          <div>
            <div class="progress" style="width: 100px">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                aria-valuenow="38"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 38%"
              ></div>
            </div>
          </div>
        </div>
      </td>
      <td class="text-end">
        <a href="#" class="btn btn-sm btn-neutral">
          View
        </a>
        <button
          type="button"
          class="btn btn-sm btn-square btn-neutral text-danger-hover"
        >
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};
