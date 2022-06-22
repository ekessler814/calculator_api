from rest_framework import serializers
from calculator.models import CalculatorMemory, Calculation
from calculator.operations import calculate

# Serializer for our CalculatorMemory model
class CalculatorMemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculatorMemory
        fields = ['id', 'session_name', 'datetime_created']
    def create(self, validated_data):
        if 'datetime_created' in validated_data:
            # disallow user specifying datetime_created on creation
            del validated_data['datetime_created']
        return super(CalculatorMemorySerializer, self).create(validated_data)

# Serializer for our Calculation model
class CalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calculation
        fields = ['id', 'inputs', 'result', 'calculator_memory', 'datetime_created']
    # override create function so we may modify param
    def create(self, validated_data):
        if 'datetime_created' in validated_data:
            # disallow user specifying datetime_created on creation
            del validated_data['datetime_created']
        # run our calculate function from operations file on inputs and set
        # value of result to output of calculate
        validated_data['result'] = calculate(validated_data['inputs'])
        return super(CalculationSerializer, self).create(validated_data)
