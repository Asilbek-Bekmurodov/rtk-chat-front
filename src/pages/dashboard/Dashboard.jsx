import {
  useDeleteChatMutation,
  useGetChatsQuery,
} from "../../app/services/chatApi";

function Dashboard() {
  const { data: chats, isloading } = useGetChatsQuery();
  const [deleteChat, { isLoading: deleteLoading }] = useDeleteChatMutation();

  async function handleDelete(id) {
    let confirm = window.confirm("Are you sure ?");

    if (confirm) {
      let res = await deleteChat(id).unwrap();
      console.log(res);
    }
  }

  if (isloading) return <h1>Loading...</h1>;

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>T/r</th>
          <th>ID</th>
          <th>Name</th>
          <th>Delete</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {chats &&
          chats.map(({ _id, title }, index) => (
            <tr key={_id}>
              <td>{index + 1}</td>
              <td>{_id}</td>
              <td>{title}</td>
              <td onClick={() => handleDelete(_id)}>
                {deleteLoading ? "Deleting..." : "X"}
              </td>
              <td>Edit</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
export default Dashboard;
