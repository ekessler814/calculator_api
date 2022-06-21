from django.urls import include, path
from rest_framework import routers
from calculator import views

# Registering basic urls for our calculator api
router = routers.DefaultRouter()
router.register(r'calculator_memories', views.CalculatorMemoryViewSet)
router.register(r'calculations', views.CalculationViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
