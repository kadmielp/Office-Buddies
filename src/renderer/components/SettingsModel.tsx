import { MODELS } from "../../models";
import { TableView } from "./TableView";

export function SettingsModel() {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'company', header: 'Company' },
    { key: 'size', header: 'Size' },
    { key: 'downloaded', header: 'Downloaded' },
  ];

  const data = MODELS.map(model => ({
    name: model.name,
    company: model.company,
    size: `${model.size.toLocaleString()} MB`,
    downloaded: `False`,
  }));

  return (
    <div>
      <p>Select the model you want to use for your chat. The larger the model, the more powerful the chat, but the slower it will be - and the more memory it will use.</p>

      <TableView columns={columns} data={data} />
    </div>
  );
}
