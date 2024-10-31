import { Button, Popconfirm, message } from 'antd';

const FailPage = ({ onDelete }) => {
  const confirmDelete = () => {
    // Call the delete function or API
    onDelete();
    message.success('User deleted successfully');
  };

  return (
    <Popconfirm
      title="Are you sure you want to delete this user?"
      onConfirm={confirmDelete}
      onCancel={() => message.info('Deletion cancelled')}
      okText="Yes"
      cancelText="No"
    >
      <Button type="primary" danger>
        Delete User
      </Button>
    </Popconfirm>
  );
};

export default FailPage;
