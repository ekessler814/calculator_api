from django.db import models
from datetime import datetime
from django.utils import timezone

"""
CalculatorMemory groups multiple Calculations in a many to one relationship.
This model allows storing a multitude of individual calculations under a session
which are dated and can be named
"""
class CalculatorMemory(models.Model):
    # auto set datetime_created as timezone.now
    # todo: don't allow passing custom values
    datetime_created = models.DateTimeField(default=timezone.now)
    # session_name stores name of calculator session
    session_name = models.CharField(max_length=20, default='default')
    class Meta:
        app_label = 'calculator'

"""
Calculation stores the datetime, inputs and calculated output of a single
calculation step. Model is foreign keyed to CalculatorMemory with many
Calculation models to a single CalculatorMemory
"""
class Calculation(models.Model):
    # calculator_memory is a foreign key to CalculatorMemory
    calculator_memory = models.ForeignKey(CalculatorMemory, on_delete=models.CASCADE)
    # inputs holds the mathematical parameters used in the calculation for example
    # 19 * 2 + 10
    inputs = models.CharField(max_length=200)
    # result holds the calculated result of running eval on inputs
    result = models.CharField(max_length=50, null=True)
    # auto set datetime_created as timezone.now
    # todo: don't allow passing custom values
    datetime_created = models.DateTimeField(default=timezone.now)
    class Meta:
        app_label = 'calculator'
