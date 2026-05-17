import { useEffect } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile, updateProfile } from '../store/profileSlice'

const { Title, Text } = Typography

const defaultAvatar =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsZu7627RHnJ-PMBEN8hHXvOcevWPw2ve6ew&s'

function EditProfile() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { data, loading, error, lastUpdatedAt } = useSelector(
    (state) => state.profile,
  )

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  useEffect(() => {
    if (!data) return
    form.setFieldsValue({
      fullName: data.fullName || '',
      phone: data.phone || '',
      address: data.address || '',
      avatar: data.avatar || '',
      email: data.email || '',
      role: data.role || '',
    })
  }, [data, form])

  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [error])

  const handleFinish = async (values) => {
    const payload = {
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
      avatar: values.avatar,
    }

    const result = await dispatch(updateProfile(payload))
    if (updateProfile.fulfilled.match(result)) {
      message.success('Profile updated successfully.')
    }
  }

  const avatarUrl = form.getFieldValue('avatar') || data?.avatar || defaultAvatar

  return (
    <div className="edit-profile">
      <header className="edit-profile__hero">
        <div>
          <Text className="eyebrow">Account Center</Text>
          <Title level={1}>Edit Profile</Title>
          <Text type="secondary">
            Keep your personal information fresh so the team can reach you fast.
          </Text>
        </div>
        <div className="edit-profile__hero-card">
          <Text className="label">Last update</Text>
          <Text className="value">
            {lastUpdatedAt
              ? new Date(lastUpdatedAt).toLocaleString()
              : 'Not updated yet'}
          </Text>
        </div>
      </header>

      <div className="edit-profile__grid">
        <Card className="profile-card">
          <div className="profile-card__avatar">
            <img src={avatarUrl} alt="Profile avatar" />
          </div>
          <Title level={4}>{data?.fullName || 'Your Name'}</Title>
          <Text type="secondary">{data?.email || 'email@example.com'}</Text>
          <div className="profile-card__meta">
            <div>
              <Text className="label">Role</Text>
              <Text>{data?.role || 'USER'}</Text>
            </div>
            <div>
              <Text className="label">Phone</Text>
              <Text>{data?.phone || '---'}</Text>
            </div>
            <div>
              <Text className="label">Address</Text>
              <Text>{data?.address || '---'}</Text>
            </div>
          </div>
        </Card>

        <Card className="profile-form" title="Personal Details">
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              requiredMark={false}
            >
              <Form.Item label="Full name" name="fullName">
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input disabled placeholder="email@example.com" />
              </Form.Item>

              <Form.Item label="Phone" name="phone">
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item label="Address" name="address">
                <Input.TextArea
                  rows={3}
                  placeholder="Street, city, country"
                />
              </Form.Item>

              <Form.Item label="Avatar URL" name="avatar">
                <Input placeholder="https://" />
              </Form.Item>

              <Form.Item label="Role" name="role">
                <Input disabled placeholder="USER" />
              </Form.Item>

              <Space className="profile-form__actions">
                <Button htmlType="button">Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save changes
                </Button>
              </Space>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>
  )
}

export default EditProfile
