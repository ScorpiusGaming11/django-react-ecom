import mimetypes

class ContentTypeMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    response = self.get_response(request)
    if request.path.startswith('/media/'):
      content_type, encoding = mimetypes.guess_type(request.path)
      if content_type:
        response['Content-Type'] = content_type
    return response