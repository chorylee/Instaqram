# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string
#  last_sign_in_ip        :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  username               :string
#  photos_count           :integer          default(0)
#  name                   :string
#  birthdate              :string
#  caption                :string
#  website                :string
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_username              (username) UNIQUE
#

class User < ApplicationRecord
  USERNAME_REGEX = /\A[a-zA-Z0-9]+\Z/

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :photos, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :temp_images, as: :imageable, dependent: :destroy, class_name: "Image"

  has_one :avatar, as: :imageable

  validates :username, uniqueness: true, presence: true,
    format: { with: USERNAME_REGEX, message: "only number and letter allowed", allow_blank: true }
  validates :name, presence: true

  def self.secret_token
    "secrets"
  end

  def self.authenticate(token)
    decoded = JWT.decode(token, User.secret_token).try(:first)
    User.find(decoded["id"])
  rescue JWT::DecodeError
    nil
  end

  def self.exposed_attributes
    %w[id name email caption website birthdate username image]
  end

  def auth_token
    JWT.encode attribute_token, User.secret_token
  end

  def attribute_token
    Hash[*User.exposed_attributes.map do |a|
      [a, a.eql?("image") ? decorated_image : send(a)]
    end.flatten(1)]
  end

  def decorated_image
    Hash[*%w[thumb small medium large original].map do |v|
      url = if v == "original"
              image.url
            else
              image.send(v).url
            end
      [v, url]
    end.flatten]
  end
end
