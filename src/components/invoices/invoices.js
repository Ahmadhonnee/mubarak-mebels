import { Invoice } from "../../components/invoice";

export const Invoices = () => {
  return (
    <div className="card">
      <div className="card-header border-bottom">
        <h5>Invoices</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-nowrap">
          <thead class="table-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Due Date</th>
              <th scope="col">Status</th>
              <th scope="col">Completion</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Invoice />
            {/* <Invoice />
            <Invoice /> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};
