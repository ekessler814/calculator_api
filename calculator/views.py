from calculator.models import CalculatorMemory, Calculation
from rest_framework import viewsets, permissions, mixins
from calculator.serializers import CalculatorMemorySerializer, CalculationSerializer
from rest_framework import status

"""
View allows listing, adding or deleting CalculatorMemory models. Update is
not allowed
"""
class CalculatorMemoryViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):

    queryset = CalculatorMemory.objects.all().order_by('-datetime_created')
    serializer_class = CalculatorMemorySerializer
    permission_classes = [permissions.IsAuthenticated]

"""
View allows adding and listing Calculation models. Deletion of Calculation
models is only allowed through cascading delete and update is not allowed
"""
class CalculationViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):

    queryset = Calculation.objects.all()
    serializer_class = CalculationSerializer
    permission_classes = [permissions.IsAuthenticated]
    """
    get_queryset is overriden to filter calculations by parameter
    calculator_memory
    """
    def get_queryset(self):

        calculator_memory = self.request.query_params.get('calculator_memory')
        if not calculator_memory:
            # if param calculator_memory isn't specified then return the entire list
            return Calculation.objects.all()

        # filter calculator_memory models by primary key
        return Calculation.objects.filter(calculator_memory__pk=calculator_memory)
