from rest_framework import serializers
from calculator.models import CalculatorMemory, Calculation
from calculator.operations import calculate

# Serializer for our CalculatorMemory model
class CalculatorMemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculatorMemory
        fields = ['id', 'session_name', 'datetime_created']

# Serializer for our Calculation model
class CalculationSerializer(serializers.ModelSerializer):
    calculator_memory_id = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    class Meta:
        model = Calculation
        fields = ['id', 'calculator_memory_id', 'inputs', 'result', 'calculator_memory', 'datetime_created']
    # override create function so we may modify param
    def create(self, validated_data):
        # run our calculate function from operations file on inputs and set
        # value of result to output of calculate
        validated_data['result']= calculate(validated_data['inputs'])
        return super(CalculationSerializer, self).create(validated_data)
