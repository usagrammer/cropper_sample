class Api::ImagesController < ApplicationController
  def create
    Image.create(image_params)
  end

  def destroy
    Image.all.each do |image|
      image.destroy
    end
    respond_to do |format|
      format.json
    end
  end

  private
  def image_params
    params.permit(:image)
  end
end